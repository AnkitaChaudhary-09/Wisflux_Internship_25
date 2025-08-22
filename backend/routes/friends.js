const express = require('express');
const { validateFriendOperation, validatePagination } = require('../middleware/validation');
const { getFriends, addFriend, removeFriend, searchUsers } = require('../controllers/friendController');
const { authenticateToken, authorizeUserParam } = require('../middleware/auth');

const router = express.Router();

// GET /api/friends/:username - Get user's friends list
router.get('/:username', authenticateToken, authorizeUserParam, getFriends);

// POST /api/friends/:username/add - Add friend to user's list
router.post('/:username/add', authenticateToken, authorizeUserParam, validateFriendOperation, addFriend);

// DELETE /api/friends/:username/remove - Remove friend from user's list
router.delete('/:username/remove', authenticateToken, authorizeUserParam, validateFriendOperation, removeFriend);

// GET /api/friends/:username/search - Search for users
router.get('/:username/search', authenticateToken, authorizeUserParam, validatePagination, searchUsers);

module.exports = router;
