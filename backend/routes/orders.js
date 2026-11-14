const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('./auth');

// POST /api/v1/orders (Place order)
router.post('/', (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, shipping_address, city, postal_code, items } = req.body;
    if (!customer_name || !customer_email || !customer_phone || !shipping_address || !city || !postal_code) {
      return res.status(400).json({ detail: 'Missing required customer and shipping address fields' });
    }
    if (!items || !items.length) {
      return res.status(400).json({ detail: 'Order must contain at least one item' });
    }

    const order = db.createOrder(req.body);
    return res.status(201).json(order);
  } catch (err) {
    return res.status(400).json({ detail: err.message });
  }
});

// GET /api/v1/orders/track/:order_number (Track order)
router.get('/track/:order_number', (req, res) => {
  const order = db.getOrderByNumber(req.params.order_number);
  if (!order) {
    return res.status(404).json({ detail: 'Order not found. Please check your Tracking ID.' });
  }
  return res.json(order);
});

// GET /api/v1/orders (Admin list)
router.get('/', requireAdmin, (req, res) => {
  const { order_status, search } = req.query;
  const orders = db.getOrders({ order_status, search });
  return res.json(orders);
});

// PATCH /api/v1/orders/:id/status (Admin update)
router.patch('/:id/status', requireAdmin, (req, res) => {
  const updated = db.updateOrderStatus(parseInt(req.params.id, 10), req.body);
  if (!updated) {
    return res.status(404).json({ detail: 'Order not found' });
  }
  return res.json(updated);
});

module.exports = router;
