const express = require('express');
const prisma = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// GET /cart — get current user's cart
router.get('/', async (req, res, next) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({ items: cartItems, total: parseFloat(total.toFixed(2)) });
  } catch (err) {
    next(err);
  }
});

// POST /cart — add item to cart
router.post('/', async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock.' });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    let cartItem;
    if (existingItem) {
      const newQty = existingItem.quantity + parseInt(quantity);
      if (product.stock < newQty) {
        return res.status(400).json({ error: 'Insufficient stock.' });
      }
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId: req.user.id, productId, quantity: parseInt(quantity) },
        include: { product: true },
      });
    }

    res.status(201).json(cartItem);
  } catch (err) {
    next(err);
  }
});

// PUT /cart/:id — update cart item quantity
router.put('/:id', async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { product: true },
    });

    if (!cartItem) return res.status(404).json({ error: 'Cart item not found.' });
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock.' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: req.params.id },
      data: { quantity: parseInt(quantity) },
      include: { product: true },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /cart/:id — remove item from cart
router.delete('/:id', async (req, res, next) => {
  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found.' });

    await prisma.cartItem.delete({ where: { id: req.params.id } });
    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    next(err);
  }
});

// DELETE /cart — clear entire cart
router.delete('/', async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
