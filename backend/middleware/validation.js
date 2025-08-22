const User = require('../models/User');
const Expense = require('../models/Expense');
const History = require('../models/History');

// Validate user registration data
const validateUserRegistration = (req, res, next) => {
  const errors = User.validate(req.body);
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

// Validate user login data
const validateUserLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];
  
  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  }
  
  if (!password || password.length === 0) {
    errors.push('Password is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

// Validate expense creation data
const validateExpenseCreation = (req, res, next) => {
  const errors = Expense.validate(req.body);
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

// Validate friend operation data
const validateFriendOperation = (req, res, next) => {
  const { friendUsername } = req.body;
  const errors = [];
  
  if (!friendUsername || friendUsername.trim().length < 3) {
    errors.push('Friend username must be at least 3 characters long');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

// Validate pagination parameters
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  const errors = [];
  
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    errors.push('Page must be a positive integer');
  }
  
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    errors.push('Limit must be between 1 and 100');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateExpenseCreation,
  validateFriendOperation,
  validatePagination
};
