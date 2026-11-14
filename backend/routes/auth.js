const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'urbankart_secret_jwt_key_2026';

// Middleware to protect admin routes
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Invalid or expired token' });
  }
}

// POST /api/v1/auth/login
router.post('/login', (req, res) => {
  const { username_or_email, password } = req.body;
  const admin = db.getAdmin();

  const isMatch = (username_or_email === admin.username || username_or_email === admin.email);
  if (!isMatch || !bcrypt.compareSync(password, admin.hashed_password)) {
    return res.status(401).json({ detail: 'Incorrect username/email or password' });
  }

  const token = jwt.sign(
    { sub: admin.id, username: admin.username, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.json({
    access_token: token,
    token_type: 'bearer',
    user: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    }
  });
});

// GET /api/v1/auth/me
router.get('/me', requireAdmin, (req, res) => {
  const admin = db.getAdmin();
  return res.json({
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role
  });
});

module.exports = { router, requireAdmin };
