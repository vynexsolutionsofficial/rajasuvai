const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Place an order
router.post('/', async (req, res) => {
  const order = new Order(req.body);
  try {
    const newOrder = await order.save();
    // WhatsApp notification logic would go here
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all orders (Admin only logic placeholder)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
