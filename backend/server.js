const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { router: authRouter } = require('./routes/auth');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');
const analyticsRouter = require('./routes/analytics');
const inquiriesRouter = require('./routes/inquiries');
const couponsRouter = require('./routes/coupons');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/inquiries', inquiriesRouter);
app.use('/api/v1/coupons', couponsRouter);

// Root & Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'UrbanKart Node.js Express API', version: '2.1.0' });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to UrbanKart Pure JavaScript Express API (INR ₹ Enterprise Edition)',
    version: '2.1.0',
    endpoints: {
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      orders: '/api/v1/orders',
      coupons: '/api/v1/coupons',
      analytics: '/api/v1/analytics/stats',
      inquiries: '/api/v1/inquiries',
      auth: '/api/v1/auth/login'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 UrbanKart Express API running on http://localhost:${PORT}`);
});
