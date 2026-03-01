const express = require('express');
const prisma = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /products — list all products (public)
router.get('/', async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /products/categories — list distinct categories (public)
router.get('/categories', async (_req, res, next) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    res.json(categories.map((c) => c.category));
  } catch (err) {
    next(err);
  }
});

// GET /products/:id — single product (public)
router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /products — create product (admin only)
router.post('/', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price), image, category, stock: parseInt(stock) },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PUT /products/:id — update product (admin only)
router.put('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(image && { image }),
        ...(category && { category }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
      },
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /products/:id — delete product (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
