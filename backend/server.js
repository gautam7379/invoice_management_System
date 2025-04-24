const express = require('express');
const cors = require('cors'); // ✅ Added CORS
const app = express();
require('dotenv').config();
const db = require('./config/db');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Auth middleware
const { protect } = require('./middlewares/authMiddleware');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Basic Test Route
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.send(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Database connection error');
  }
});

// Protected route example
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: `Hello User ${req.user.userId}, your role is ${req.user.role}` });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
