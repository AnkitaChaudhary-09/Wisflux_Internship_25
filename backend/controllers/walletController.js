const { readData, findByUsername } = require('../utils/dataManager');
const User = require('../models/User');
const { NotFoundError } = require('../middleware/errorHandler');

// Get user's wallet balance
const getWalletBalance = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    // Read users
    const users = await readData('users.json');
    
    // Find user
    const user = findByUsername(users, username);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.json({
      username: user.username,
      currentBalance: parseFloat(user.wallet.toFixed(2)),
      lastUpdated: user.updatedAt || user.createdAt
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWalletBalance
};
