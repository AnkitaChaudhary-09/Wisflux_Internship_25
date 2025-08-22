const express = require('express');
const { validatePagination } = require('../middleware/validation');
const { getUserHistory, getUserSummary, getExpenseHistory } = require('../controllers/historyController');
const { authenticateToken, authorizeUserParam } = require('../middleware/auth');

const router = express.Router();

// GET /api/history/:username - Get user's transaction history
router.get('/:username', authenticateToken, authorizeUserParam, validatePagination, getUserHistory);

// GET /api/history/:username/summary - Get user's transaction summary
router.get('/:username/summary', authenticateToken, authorizeUserParam, getUserSummary);

// GET /api/history/:username/expense/:expenseId - Get expense-specific history
router.get('/:username/expense/:expenseId', authenticateToken, authorizeUserParam, getExpenseHistory);

module.exports = router;
