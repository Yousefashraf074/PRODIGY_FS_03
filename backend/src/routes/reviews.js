const express = require('express');
const prisma = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /reviews/:productId - Get all reviews for a product
router.get('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
    });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// POST /reviews/:productId - Add a review for a product
router.post('/:productId', authenticate, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: { productId, userId },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: 'You have already reviewed this product.' });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId,
      },
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
