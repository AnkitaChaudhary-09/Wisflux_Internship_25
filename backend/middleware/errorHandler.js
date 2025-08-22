// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = err.message;
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = err.message;
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
    message = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path
  });
};

// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};

// Custom error classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError
};
