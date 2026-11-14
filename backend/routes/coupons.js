const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('./auth');

// GET /api/v1/coupons
router.get('/', (req, res) => {
  const coupons = db.getCoupons();
  return res.json(coupons);
});

// POST /api/v1/coupons/validate
router.post('/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, message: 'Please provide a coupon code' });
  }
  const result = db.validateCoupon(code, Number(subtotal) || 0);
  return res.json(result);
});

// POST /api/v1/coupons (Admin add)
router.post('/', requireAdmin, (req, res) => {
  try {
    const coupon = db.createCoupon(req.body);
    return res.status(201).json(coupon);
  } catch (err) {
    return res.status(400).json({ detail: err.message });
  }
});

// DELETE /api/v1/coupons/:code (Admin delete)
router.delete('/:code', requireAdmin, (req, res) => {
  const success = db.deleteCoupon(req.params.code);
  return res.json({ message: 'Coupon removed', success });
});

module.exports = router;
