const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET all orders
router.get('/api/orders', authMiddleware, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        product: true
      }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// GET single order
router.get('/api/orders/:id', authMiddleware, async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true,
        product: true
      }
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// POST create order
router.post('/api/orders', authMiddleware, async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;
    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        productId: parseInt(productId),
        quantity: parseInt(quantity)
      },
      include: {
        user: true,
        product: true
      }
    });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// DELETE order
router.delete('/api/orders/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.order.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
