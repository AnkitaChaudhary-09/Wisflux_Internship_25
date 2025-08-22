const express = require('express');
const { validateExpenseCreation, validatePagination } = require('../middleware/validation');
const { createExpense, getAllExpenses, getExpenseById, getExpensesByUser } = require('../controllers/expenseController');
const { authenticateToken, authorizeUserParam } = require('../middleware/auth');

const router = express.Router();

// POST /api/expenses - Create new expense and split money
router.post('/', authenticateToken, validateExpenseCreation, createExpense);

// GET /api/expenses - Get all expenses
router.get('/', authenticateToken, validatePagination, getAllExpenses);

// GET /api/expenses/:id - Get expense by ID
router.get('/:id', authenticateToken, getExpenseById);

// GET /api/expenses/user/:username - Get expenses by user
router.get('/user/:username', authenticateToken, authorizeUserParam, validatePagination, getExpensesByUser);

module.exports = router;
