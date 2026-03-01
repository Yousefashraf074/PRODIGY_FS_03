const request = require('supertest');
const app = require('../src/server');

// Helper: check if DB is reachable (some tests need it)
let dbAvailable = false;
beforeAll(async () => {
  try {
    const prisma = require('../src/config/database');
    await prisma.$connect();
    dbAvailable = true;
  } catch {
    dbAvailable = false;
    console.warn('⚠ Database not available — DB-dependent tests will be skipped');
  }
});

afterAll(async () => {
  try {
    const prisma = require('../src/config/database');
    await prisma.$disconnect();
  } catch { /* ignore */ }
});

describe('Health Check', () => {
  it('GET /api/health should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('Metrics Endpoint', () => {
  it('GET /api/metrics should return Prometheus metrics', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
  });
});

describe('Auth Routes', () => {
  it('POST /api/auth/register should reject invalid input', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/login should reject invalid credentials', async () => {
    if (!dbAvailable) return; // needs DB
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@test.com', password: 'wrong' });
    expect([400, 401]).toContain(res.statusCode);
  });
});

describe('Products Routes', () => {
  it('GET /api/products should return products list', async () => {
    if (!dbAvailable) return; // needs DB
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('pagination');
  });

  it('GET /api/products/categories should return categories', async () => {
    if (!dbAvailable) return; // needs DB
    const res = await request(app).get('/api/products/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('Protected Routes', () => {
  it('GET /api/cart should require authentication', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/orders should require authentication', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(401);
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toBe(404);
  });
});
