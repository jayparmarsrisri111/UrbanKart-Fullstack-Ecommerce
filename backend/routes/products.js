const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('./auth');

// GET /api/v1/products
router.get('/', (req, res) => {
  const { category, search, is_featured, is_trending, min_price, max_price, sort_by } = req.query;
  const products = db.getProducts({
    category,
    search,
    is_featured: is_featured !== undefined ? is_featured === 'true' : undefined,
    is_trending: is_trending !== undefined ? is_trending === 'true' : undefined,
    min_price: min_price ? parseFloat(min_price) : undefined,
    max_price: max_price ? parseFloat(max_price) : undefined,
    sort_by
  });
  return res.json(products);
});

// GET /api/v1/products/:idOrSlug
router.get('/:idOrSlug', (req, res) => {
  const product = db.getProductByIdOrSlug(req.params.idOrSlug);
  if (!product) {
    return res.status(404).json({ detail: 'Product not found' });
  }
  return res.json(product);
});

// POST /api/v1/products/:id/reviews (Customer review)
router.post('/:id/reviews', (req, res) => {
  const { author, rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ detail: 'Rating and review comment are required' });
  }
  const updatedProduct = db.addProductReview(parseInt(req.params.id, 10), { author, rating, comment });
  if (!updatedProduct) {
    return res.status(404).json({ detail: 'Product not found' });
  }
  return res.status(201).json(updatedProduct);
});

// POST /api/v1/products (Admin)
router.post('/', requireAdmin, (req, res) => {
  try {
    const product = db.createProduct(req.body);
    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json({ detail: err.message });
  }
});

// PUT /api/v1/products/:id (Admin update)
router.put('/:id', requireAdmin, (req, res) => {
  const updated = db.updateProduct(parseInt(req.params.id, 10), req.body);
  if (!updated) {
    return res.status(404).json({ detail: 'Product not found' });
  }
  return res.json(updated);
});

// DELETE /api/v1/products/:id (Admin delete)
router.delete('/:id', requireAdmin, (req, res) => {
  const success = db.deleteProduct(parseInt(req.params.id, 10));
  if (!success) {
    return res.status(404).json({ detail: 'Product not found' });
  }
  return res.json({ message: 'Product deleted successfully', id: parseInt(req.params.id, 10) });
});

module.exports = router;
