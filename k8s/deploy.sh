#!/bin/bash
# =============================================================================
# LocalStore E-commerce — Kubernetes Deployment Script
# =============================================================================
# Usage:
#   ./k8s/deploy.sh [command] [options]
#
# Commands:
#   apply       Deploy using raw manifests (kubectl)
#   delete      Remove all raw manifest resources
#   helm-dev    Deploy with Helm (development)
#   helm-stg    Deploy with Helm (staging)
#   helm-prod   Deploy with Helm (production)
#   helm-del    Uninstall Helm release
#   status      Show deployment status
#   logs        Tail logs for a component (backend|frontend|postgres)
#   seed        Run database seed job
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
NAMESPACE="localstore"
RELEASE_NAME="localstore"
HELM_CHART_DIR="$PROJECT_DIR/helm/localstore"
K8S_DIR="$SCRIPT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info()  { echo -e "${CYAN}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_err()   { echo -e "${RED}[ERROR]${NC} $1"; }

# ---------------------------------------------------------------------------
# Pre-flight checks
# ---------------------------------------------------------------------------
preflight() {
  command -v kubectl >/dev/null 2>&1 || { log_err "kubectl not found"; exit 1; }
  kubectl cluster-info >/dev/null 2>&1 || { log_err "Cannot connect to Kubernetes cluster"; exit 1; }
  log_ok "Cluster connection verified"
}

# ---------------------------------------------------------------------------
# Raw Manifest Deployment
# ---------------------------------------------------------------------------
apply_manifests() {
  preflight
  log_info "Deploying LocalStore with raw manifests..."

  log_info "Creating namespace..."
  kubectl apply -f "$K8S_DIR/namespace.yaml"

  log_info "Applying secrets & configmap..."
  kubectl apply -f "$K8S_DIR/secrets.yaml"
  kubectl apply -f "$K8S_DIR/configmap.yaml"

  log_info "Deploying PostgreSQL..."
  kubectl apply -f "$K8S_DIR/postgres/"

  log_info "Waiting for PostgreSQL to be ready..."
  kubectl wait --for=condition=ready pod -l app=localstore,component=postgresql \
    -n "$NAMESPACE" --timeout=120s || log_warn "PostgreSQL pod not ready yet"

  log_info "Deploying Backend..."
  kubectl apply -f "$K8S_DIR/backend/"

  log_info "Deploying Frontend..."
  kubectl apply -f "$K8S_DIR/frontend/"

  log_info "Applying Ingress..."
  kubectl apply -f "$K8S_DIR/ingress.yaml"

  log_ok "All manifests applied successfully!"
  echo ""
  show_status
}

delete_manifests() {
  preflight
  log_warn "Deleting all LocalStore resources..."

  kubectl delete -f "$K8S_DIR/ingress.yaml" --ignore-not-found
  kubectl delete -f "$K8S_DIR/frontend/" --ignore-not-found
  kubectl delete -f "$K8S_DIR/backend/" --ignore-not-found
  kubectl delete -f "$K8S_DIR/postgres/" --ignore-not-found
  kubectl delete -f "$K8S_DIR/configmap.yaml" --ignore-not-found
  kubectl delete -f "$K8S_DIR/secrets.yaml" --ignore-not-found
  kubectl delete -f "$K8S_DIR/namespace.yaml" --ignore-not-found

  log_ok "All resources deleted"
}

# ---------------------------------------------------------------------------
# Helm Deployments
# ---------------------------------------------------------------------------
helm_deploy() {
  local env="$1"
  preflight
  command -v helm >/dev/null 2>&1 || { log_err "helm not found"; exit 1; }

  local values_file="$HELM_CHART_DIR/values-${env}.yaml"
  local ns="${NAMESPACE}"

  case "$env" in
    dev)  ns="localstore-dev" ;;
    staging) ns="localstore-staging" ;;
    prod) ns="localstore-prod" ;;
  esac

  if [ ! -f "$values_file" ]; then
    log_err "Values file not found: $values_file"
    exit 1
  fi

  log_info "Deploying LocalStore via Helm (${env}) to namespace ${ns}..."

  helm upgrade --install "$RELEASE_NAME" "$HELM_CHART_DIR" \
    -f "$values_file" \
    --namespace "$ns" \
    --create-namespace \
    --wait \
    --timeout 5m

  log_ok "Helm deployment (${env}) complete!"
  echo ""
  kubectl get pods -n "$ns"
}

helm_delete() {
  preflight
  command -v helm >/dev/null 2>&1 || { log_err "helm not found"; exit 1; }

  local ns="${1:-$NAMESPACE}"
  log_warn "Uninstalling Helm release '${RELEASE_NAME}' from namespace '${ns}'..."
  helm uninstall "$RELEASE_NAME" --namespace "$ns" || true
  log_ok "Helm release uninstalled"
}

# ---------------------------------------------------------------------------
# Status & Logs
# ---------------------------------------------------------------------------
show_status() {
  echo -e "${CYAN}=== LocalStore Kubernetes Status ===${NC}"
  echo ""

  local ns
  for ns in "$NAMESPACE" localstore-dev localstore-staging localstore-prod; do
    if kubectl get namespace "$ns" >/dev/null 2>&1; then
      echo -e "${GREEN}Namespace: ${ns}${NC}"
      kubectl get pods -n "$ns" -o wide 2>/dev/null || true
      kubectl get svc -n "$ns" 2>/dev/null || true
      kubectl get ingress -n "$ns" 2>/dev/null || true
      kubectl get hpa -n "$ns" 2>/dev/null || true
      echo ""
    fi
  done
}

show_logs() {
  local component="${1:-backend}"
  local ns="${2:-$NAMESPACE}"
  log_info "Tailing logs for ${component} in ${ns}..."
  kubectl logs -f -l "app=localstore,component=${component}" \
    -n "$ns" --tail=100 --all-containers
}

# ---------------------------------------------------------------------------
# Database Seed
# ---------------------------------------------------------------------------
run_seed() {
  local ns="${1:-$NAMESPACE}"
  preflight
  log_info "Running database seed in namespace ${ns}..."

  local backend_pod
  backend_pod=$(kubectl get pod -l "app=localstore,component=backend" \
    -n "$ns" -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)

  if [ -z "$backend_pod" ]; then
    log_err "No backend pod found in namespace ${ns}"
    exit 1
  fi

  kubectl exec -n "$ns" "$backend_pod" -- npx prisma db seed
  log_ok "Database seeded successfully!"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
case "${1:-help}" in
  apply)
    apply_manifests
    ;;
  delete)
    delete_manifests
    ;;
  helm-dev)
    helm_deploy "dev"
    ;;
  helm-stg)
    helm_deploy "staging"
    ;;
  helm-prod)
    helm_deploy "prod"
    ;;
  helm-del)
    helm_delete "${2:-$NAMESPACE}"
    ;;
  status)
    preflight
    show_status
    ;;
  logs)
    show_logs "${2:-backend}" "${3:-$NAMESPACE}"
    ;;
  seed)
    run_seed "${2:-$NAMESPACE}"
    ;;
  help|*)
    echo ""
    echo "LocalStore Kubernetes Deploy Script"
    echo "===================================="
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  apply          Deploy with raw kubectl manifests"
    echo "  delete         Remove all raw manifest resources"
    echo "  helm-dev       Deploy with Helm (development)"
    echo "  helm-stg       Deploy with Helm (staging)"
    echo "  helm-prod      Deploy with Helm (production)"
    echo "  helm-del [ns]  Uninstall Helm release from namespace"
    echo "  status         Show deployment status across namespaces"
    echo "  logs [comp]    Tail logs (backend|frontend|postgres)"
    echo "  seed [ns]      Run database seed script"
    echo ""
    ;;
esac
