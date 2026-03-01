const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/api/products', requireAuth, async (req, res, next) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET single product
router.get('/api/products/:id', requireAuth, async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST create product
router.post('/api/products', requireAuth, async (req, res, next) => {
  try {
    const { name, price, stock } = req.body;
    const product = await prisma.product.create({
      data: { name, price: parseFloat(price), stock: parseInt(stock) }
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// PUT update product
router.put('/api/products/:id', requireAuth, async (req, res, next) => {
  try {
    const { name, price, stock } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (price !== undefined) data.price = parseFloat(price);
    if (stock !== undefined) data.stock = parseInt(stock);

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// DELETE product
router.delete('/api/products/:id', requireAuth, async (req, res, next) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
