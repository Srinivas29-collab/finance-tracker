const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Server is running'
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('❌ MongoDB connection error:', err.message);
  });

// Routes
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);


// Middleware
const authMiddleware = require('./middleware/auth');

// Test protected route
app.get('/api/protected/user', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected route',
    userId: req.userId,
    userEmail: req.userEmail
  });
});

// Transaction routes
const transactionRoutes = require('./routes/transactions');
app.use('/api/transactions', transactionRoutes);

// 404 route
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});