const express = require('express');
const { getWalletBalance } = require('../controllers/walletController');
const { authenticateToken, authorizeUserParam } = require('../middleware/auth');

const router = express.Router();

// GET /api/wallet/:username - Get current wallet balance for a user
router.get('/:username', authenticateToken, authorizeUserParam, getWalletBalance);

module.exports = router;
