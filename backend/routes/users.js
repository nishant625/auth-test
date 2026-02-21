const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET all users
router.get('/api/users', authMiddleware, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET single user
router.get('/api/users/:id', authMiddleware, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST create user
router.post('/api/users', authMiddleware, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: { name, email }
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// PUT update user
router.put('/api/users/:id', authMiddleware, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, email }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// DELETE user
router.delete('/api/users/:id', authMiddleware, async (req, res, next) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
