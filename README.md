# 🛒 LocalStore E-Commerce Platform

A production-ready full-stack e-commerce application with complete DevOps integration, featuring product search, user reviews, admin panel, and a modern teal-themed UI.

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Helm-blue?logo=kubernetes)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-black?logo=github-actions)

---

## Screenshots

<table>
  <tr>
    <td align="center"><b>Landing Page — Hero & Categories</b></td>
    <td align="center"><b>Browse & Search Products</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/d07c50a0-a98d-4d69-877e-1eb3002abacd" alt="Landing Page" /></td>
    <td><img src="https://github.com/user-attachments/assets/44205154-7869-4152-8e4e-92a8b00f87ef" alt="Browse Products" /></td>
  </tr>
  <tr>
    <td align="center"><b>Product Page with Customer Reviews</b></td>
    <td align="center"><b>Cart & Checkout Summary</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/e28c79ba-fc42-4284-b2c1-76d38a9933e1" alt="Product Page" /></td>
    <td><img src="https://github.com/user-attachments/assets/2d7e98ed-a24b-4670-ab17-da19baeed528" alt="Cart & Checkout" /></td>
  </tr>
  <tr>
    <td align="center"><b>Secure Login & Registration</b></td>
    <td align="center"><b>Admin Dashboard — Manage Store</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/9963d9be-cdcf-4d57-a776-273869aedc9f" alt="Login & Registration" /></td>
    <td><img src="https://github.com/user-attachments/assets/1128f6e5-05fb-4bbe-b445-c5ac3330a804" alt="Admin Dashboard" /></td>
  </tr>
  <tr>
    <td align="center"><b>PostgreSQL Database via pgAdmin</b></td>
    <td align="center"><b>Docker Services Overview</b></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/e12b46cd-2866-4512-b01e-a002e0abcfc0" alt="PostgreSQL Database" /></td>
    <td><img src="https://github.com/user-attachments/assets/d8c77e57-598c-40ee-b948-d35f11029082" alt="Docker Services" /></td>
  </tr>
</table>

---

## 🏗️ Architecture

```
                    ┌──────────────┐
                    │   Nginx      │ :80
                    │ Reverse Proxy│
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │                         │
     ┌────────▼────────┐      ┌────────▼────────┐
     │   Frontend       │      │   Backend        │
     │   React + Vite   │      │   Express.js     │ :5000
     │   TailwindCSS    │      │   REST API       │
     └─────────────────┘      │   JWT Auth       │
                               └────────┬────────┘
                                        │
                               ┌────────▼────────┐
                               │   PostgreSQL     │ :5432
                               │   Prisma ORM    │
                               └─────────────────┘
                                        │
                               ┌────────▼────────┐
                               │   Prometheus     │ :9090
                               │   Monitoring     │
                               └─────────────────┘
```

## 🛠️ Tech Stack

| Layer         | Technology                  |
| ------------- | --------------------------- |
| Frontend      | React 18, Vite, TailwindCSS |
| Backend       | Node.js, Express.js         |
| Database      | PostgreSQL 16, Prisma ORM   |
| Auth          | JWT + bcrypt (role-based)   |
| Proxy         | Nginx                       |
| Containers    | Docker, Docker Compose      |
| Orchestration | Kubernetes, Helm 3          |
| CI/CD         | GitHub Actions              |
| Monitoring    | Prometheus + prom-client    |

## ✨ Features

- **Product Catalog** — Browse, search, and filter 40+ products across 5 categories
- **Product Reviews** — Star ratings and written reviews from customers
- **Shopping Cart** — Add, update, remove items with real-time totals
- **Order Management** — Place orders and view order history
- **User Profile** — View account details and membership info
- **Admin Panel** — Full CRUD for products, orders, and user management
- **Authentication** — Register, login with JWT + role-based access (Customer/Admin)
- **Search** — Debounced product search across all categories
- **Responsive UI** — Modern teal-themed design with TailwindCSS
- **Metrics** — Prometheus-compatible `/api/metrics` endpoint
- **Security** — Helmet, rate limiting, CORS, input validation

---

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js 20+](https://nodejs.org/) (for local development)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/localstore-ecommerce-devops.git
cd localstore-ecommerce-devops
```

### 2. Start with Docker Compose (recommended)

```bash
# Start all services
docker compose up -d --build

# Seed the database with sample products
docker compose exec backend npx prisma db seed
```

The app will be available at:

| Service     | URL                       |
| ----------- | ------------------------- |
| Frontend    | http://localhost:3005     |
| Backend API | http://localhost:5000/api |
| Nginx Proxy | http://localhost:3004     |
| Prometheus  | http://localhost:9090     |

### 3. Demo Credentials

| Role     | Email                | Password    |
| -------- | -------------------- | ----------- |
| Admin    | admin@localstore.com | admin123    |
| Customer | customer@example.com | customer123 |

### 4. Database Connection (pgAdmin 4)

| Field    | Value            |
| -------- | ---------------- |
| Host     | localhost        |
| Port     | 5432             |
| Database | localstore_db    |
| Username | localstore       |
| Password | localstore_pass  |

---

## 💻 Local Development (without Docker)

### Backend

```bash
cd backend
cp .env.example .env          # Edit DB credentials as needed
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev                    # Starts on :5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                    # Starts on :5173 with API proxy
```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint           | Description       | Auth |
| ------ | ------------------ | ----------------- | ---- |
| POST   | /api/auth/register | Register new user | No   |
| POST   | /api/auth/login    | Login             | No   |

### Products

| Method | Endpoint                 | Description     | Auth  |
| ------ | ------------------------ | --------------- | ----- |
| GET    | /api/products            | List products   | No    |
| GET    | /api/products/categories | List categories | No    |
| GET    | /api/products/:id        | Product details | No    |
| POST   | /api/products            | Create product  | Admin |
| PUT    | /api/products/:id        | Update product  | Admin |
| DELETE | /api/products/:id        | Delete product  | Admin |

### Cart

| Method | Endpoint      | Description     | Auth     |
| ------ | ------------- | --------------- | -------- |
| GET    | /api/cart     | Get cart        | Required |
| POST   | /api/cart     | Add to cart     | Required |
| PUT    | /api/cart/:id | Update quantity | Required |
| DELETE | /api/cart/:id | Remove item     | Required |
| DELETE | /api/cart     | Clear cart      | Required |

### Orders

| Method | Endpoint        | Description   | Auth     |
| ------ | --------------- | ------------- | -------- |
| GET    | /api/orders     | List orders   | Required |
| GET    | /api/orders/:id | Order details | Required |
| POST   | /api/orders     | Place order   | Required |

### Reviews

| Method | Endpoint             | Description       | Auth     |
| ------ | -------------------- | ----------------- | -------- |
| GET    | /api/reviews/:productId | Get reviews    | No       |
| POST   | /api/reviews/:productId | Add review     | Required |

### Profile

| Method | Endpoint      | Description     | Auth     |
| ------ | ------------- | --------------- | -------- |
| GET    | /api/profile  | Get profile     | Required |

### Admin

| Method | Endpoint            | Description       | Auth  |
| ------ | ------------------- | ----------------- | ----- |
| GET    | /api/admin/users    | List all users    | Admin |
| GET    | /api/admin/orders   | List all orders   | Admin |
| GET    | /api/admin/products | List all products | Admin |
| POST   | /api/admin/products | Create product    | Admin |
| PUT    | /api/admin/products/:id | Update product | Admin |
| DELETE | /api/admin/products/:id | Delete product | Admin |

### System

| Method | Endpoint     | Description        |
| ------ | ------------ | ------------------ |
| GET    | /api/health  | Health check       |
| GET    | /api/metrics | Prometheus metrics |

---

## 📁 Project Structure

```
localstore-ecommerce-devops/
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # Navbar, Footer, ProductCard, ProtectedRoute, Reviews
│   │   ├── context/         # AuthContext, CartContext
│   │   ├── pages/           # Home, ProductDetail, Cart, Login, Orders, Profile
│   │   │   └── admin/       # AdminDashboard, AdminProducts, AdminOrders, AdminUsers
│   │   ├── test/            # Vitest tests
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/          # App config, Prisma client
│   │   ├── middleware/      # Auth, error handler
│   │   ├── routes/          # auth, products, cart, orders, reviews, profile, admin
│   │   ├── metrics.js       # Prometheus metrics
│   │   └── server.js        # Express app entry
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
├── k8s/                         # Raw Kubernetes manifests
│   ├── namespace.yaml
│   ├── secrets.yaml
│   ├── configmap.yaml
│   ├── postgres/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── pvc.yaml
│   ├── backend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml
│   ├── ingress.yaml
│   └── deploy.sh               # Deployment helper script
│
├── helm/localstore/             # Helm chart
│   ├── Chart.yaml
│   ├── values.yaml              # Default values
│   ├── values-dev.yaml          # Development overrides
│   ├── values-staging.yaml      # Staging overrides
│   ├── values-prod.yaml         # Production overrides
│   └── templates/
│       ├── _helpers.tpl
│       ├── secrets.yaml
│       ├── configmap.yaml
│       ├── postgresql.yaml
│       ├── backend.yaml
│       ├── frontend.yaml
│       ├── ingress.yaml
│       └── NOTES.txt
│
├── database/
│   └── schema.sql           # Reference SQL schema
│
├── nginx/
│   └── nginx.conf           # Reverse proxy config
│
├── prometheus/
│   └── prometheus.yml       # Scrape config
│
├── .github/workflows/
│   └── ci-cd.yml            # GitHub Actions pipeline
│
├── screenshots/             # Application screenshots
├── docker-compose.yml
└── README.md
```

---

## ⚙️ CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push to `main`/`develop` and on PRs:

1. **Test Backend** — Install deps, run Prisma migrations on test DB, execute Jest tests
2. **Test Frontend** — Install deps, run Vitest tests, build production bundle
3. **Build & Push** — Build Docker images and push to Docker Hub (main branch only)
4. **Deploy** — Deployment notification placeholder (customizable)

### Required GitHub Secrets

| Secret                | Description             |
| --------------------- | ----------------------- |
| `DOCKER_HUB_USERNAME` | Docker Hub username     |
| `DOCKER_HUB_TOKEN`    | Docker Hub access token |

---

## 📊 Monitoring

Prometheus scrapes the backend metrics endpoint every 15 seconds.

**Available metrics:**

- `http_request_duration_seconds` — Request latency histogram
- `http_requests_total` — Total request counter
- `active_users` — Active user gauge
- `orders_total` — Total orders counter
- Default Node.js metrics (CPU, memory, event loop, GC)

Access Prometheus UI at http://localhost:9090

---

## ☸️ Kubernetes Deployment

### Architecture

```
                     ┌─────────────────────┐
                     │   Ingress (nginx)    │
                     │   localstore.local   │
                     └──────────┬──────────┘
                                │
               ┌────────────────┼────────────────┐
               │ /api/*                          │ /*
      ┌────────▼────────┐              ┌────────▼────────┐
      │  Backend Service │              │ Frontend Service │
      │  ClusterIP:5000  │              │  ClusterIP:80    │
      └────────┬────────┘              └─────────────────┘
               │                         HPA: 2→6 replicas
               │  HPA: 2→10 replicas
      ┌────────▼────────┐
      │ PostgreSQL Svc   │
      │ ClusterIP:5432   │
      │ PVC: 5Gi         │
      └─────────────────┘
```

### Prerequisites

- A Kubernetes cluster (minikube, kind, EKS, GKE, AKS, etc.)
- `kubectl` configured for your cluster
- `helm` 3.x (for Helm deployments)
- An nginx Ingress Controller installed

### Option 1 — Raw Manifests (kubectl)

```bash
# Deploy everything in order
./k8s/deploy.sh apply

# Check status
./k8s/deploy.sh status

# Seed the database
./k8s/deploy.sh seed

# Tail backend logs
./k8s/deploy.sh logs backend

# Tear down
./k8s/deploy.sh delete
```

Or manually:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress.yaml
```

### Option 2 — Helm Chart

```bash
# Development (local cluster, 1 replica, no TLS)
helm upgrade --install localstore ./helm/localstore \
  -f ./helm/localstore/values-dev.yaml \
  -n localstore-dev --create-namespace

# Staging (2 replicas, autoscaling, TLS via cert-manager)
helm upgrade --install localstore ./helm/localstore \
  -f ./helm/localstore/values-staging.yaml \
  -n localstore-staging --create-namespace

# Production (3+ replicas, strict resources, TLS, rate limiting)
helm upgrade --install localstore ./helm/localstore \
  -f ./helm/localstore/values-prod.yaml \
  -n localstore-prod --create-namespace \
  --set secrets.jwtSecret="$(openssl rand -base64 32)" \
  --set secrets.postgresPassword="$(openssl rand -base64 24)"
```

Or use the deploy script shortcuts:

```bash
./k8s/deploy.sh helm-dev     # Development
./k8s/deploy.sh helm-stg     # Staging
./k8s/deploy.sh helm-prod    # Production
./k8s/deploy.sh helm-del     # Uninstall
```

### Environment Configs

| File                  | Purpose                                             |
| --------------------- | --------------------------------------------------- |
| `values.yaml`         | Default values (base)                               |
| `values-dev.yaml`     | 1 replica, local images, no TLS, 1Gi PVC            |
| `values-staging.yaml` | 2 replicas, autoscaling, staging TLS                |
| `values-prod.yaml`    | 3+ replicas, strict limits, prod TLS, rate limiting |

### Accessing the Application

For local clusters (minikube/kind), add to your hosts file:

```
# /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 localstore.local
```

With minikube:

```bash
minikube addons enable ingress
minikube tunnel
# Access at http://localstore.local
```

---

## ✅ Production Deployment Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `POSTGRES_PASSWORD` to a secure password
- [ ] Configure SSL/TLS termination (Nginx or Ingress)
- [ ] Enable Nginx access logs for auditing
- [ ] Set up database backups (pg_dump CronJob or cloud snapshots)
- [ ] Configure rate limiting values for production load
- [ ] Add Grafana for metrics visualization
- [ ] Set up alerting rules in Prometheus
- [ ] Use Docker secrets, K8s Secrets, or a vault for sensitive values
- [ ] Configure HPA thresholds based on load testing
- [ ] Set up Pod Disruption Budgets for zero-downtime upgrades
- [ ] Enable NetworkPolicies for pod-to-pod traffic control
- [ ] Configure resource quotas per namespace
- [ ] Set up cert-manager for automated TLS certificates

---

## 📄 License

MIT
