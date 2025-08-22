const express = require('express');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const { register, login, getProfile } = require('../controllers/authController');
const { authenticateToken, authorizeUserParam } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - User registration
router.post('/register', validateUserRegistration, register);

// POST /api/auth/login - User login
router.post('/login', validateUserLogin, login);

// GET /api/auth/profile/:username - Get user profile
router.get('/profile/:username', authenticateToken, authorizeUserParam, getProfile);

module.exports = router;
