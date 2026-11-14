const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('./auth');

// POST /api/v1/inquiries (Customer message)
router.post('/', (req, res) => {
  try {
    const inq = db.createInquiry(req.body);
    return res.status(201).json(inq);
  } catch (err) {
    return res.status(400).json({ detail: err.message });
  }
});

// GET /api/v1/inquiries (Admin list)
router.get('/', requireAdmin, (req, res) => {
  const list = db.getInquiries();
  return res.json(list);
});

// PATCH /api/v1/inquiries/:id/status (Admin update)
router.patch('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.query;
  const updated = db.updateInquiryStatus(parseInt(req.params.id, 10), status);
  if (!updated) {
    return res.status(404).json({ detail: 'Inquiry not found' });
  }
  return res.json(updated);
});

module.exports = router;
