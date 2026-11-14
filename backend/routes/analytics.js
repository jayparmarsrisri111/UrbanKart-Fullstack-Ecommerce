const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('./auth');

// GET /api/v1/analytics/stats (Admin stats)
router.get('/stats', requireAdmin, (req, res) => {
  const stats = db.getAnalytics();
  return res.json(stats);
});

module.exports = router;
