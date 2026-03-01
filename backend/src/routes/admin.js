const express = require('express');
const prisma = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes in this file are protected and only accessible by admins.
router.use(authenticate, authorizeAdmin);

// GET /admin/users - Get all users
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /admin/orders - Get all orders
router.get('/orders', async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } },
      },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /admin/products - Get all products
router.get('/products', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// POST /admin/products - Create a new product
router.post('/products', async (req, res, next) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PUT /admin/products/:id - Update a product
router.put('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/products/:id - Delete a product
router.delete('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
