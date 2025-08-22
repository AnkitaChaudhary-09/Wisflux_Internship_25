const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Import route modules
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const friendRoutes = require('./routes/friends');
const historyRoutes = require('./routes/history');
const walletRoutes = require('./routes/wallet');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/wallet', walletRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Money Splitter Backend API is running!' });
});

// 404 handler for undefined routes
app.use('*', notFoundHandler);

// Global error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
