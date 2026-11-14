const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/v1/categories
router.get('/', (req, res) => {
  const categories = db.getCategories();
  return res.json(categories);
});

module.exports = router;
