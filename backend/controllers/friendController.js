const { readData, writeData, findByUsername } = require('../utils/dataManager');
const User = require('../models/User');
const { ValidationError, NotFoundError, ConflictError } = require('../middleware/errorHandler');

// Get user's friends list
const getFriends = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    // Read users
    const users = await readData('users.json');
    
    // Find user
    const user = findByUsername(users, username);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Get friend details
    const friendsList = [];
    const userFriends = Array.isArray(user.friends) ? user.friends : [];
    for (const friendUsername of userFriends) {
      const friend = findByUsername(users, friendUsername);
      if (friend) {
        friendsList.push({
          username: friend.username,
          wallet: parseFloat(friend.wallet.toFixed(2))
        });
      }
    }
    
    res.json({
      username,
      friends: friendsList,
      total: friendsList.length
    });
    
  } catch (error) {
    next(error);
  }
};

// Add friend to user's list
const addFriend = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { friendUsername } = req.body;
    
    // Read users
    const users = await readData('users.json');
    
    // Find user
    const user = findByUsername(users, username);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Find friend
    const friend = findByUsername(users, friendUsername);
    if (!friend) {
      throw new NotFoundError('Friend user not found');
    }
    
    // Check if already friends
    const userFriends = Array.isArray(user.friends) ? user.friends : [];
    if (userFriends.includes(friendUsername)) {
      throw new ConflictError('User is already in your friends list');
    }
    
    // Check if trying to add self
    if (username === friendUsername) {
      throw new ValidationError('Cannot add yourself as a friend');
    }
    
    // Create User instances
    const userInstance = new User(user);
    const friendInstance = new User(friend);
    
    // Add friend to user's list
    userInstance.addFriend(friendUsername);
    
    // Update user in users array
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = userInstance;
    }
    
    // Save updated data
    await writeData('users.json', users);
    
    res.json({
      message: 'Friend added successfully',
      username,
      friend: friendUsername,
      friends: userInstance.friends
    });
    
  } catch (error) {
    next(error);
  }
};

// Remove friend from user's list
const removeFriend = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { friendUsername } = req.body;
    
    // Read users
    const users = await readData('users.json');
    
    // Find user
    const user = findByUsername(users, username);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Check if friend exists in list
    if (!Array.isArray(user.friends) || !user.friends.includes(friendUsername)) {
      throw new NotFoundError('User is not in your friends list');
    }
    
    // Create User instance
    const userInstance = new User(user);
    
    // Remove friend
    userInstance.removeFriend(friendUsername);
    
    // Update user in users array
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = userInstance;
    }
    
    // Save updated data
    await writeData('users.json', users);
    
    res.json({
      message: 'Friend removed successfully',
      username,
      friend: friendUsername,
      friends: userInstance.friends
    });
    
  } catch (error) {
    next(error);
  }
};

// Search for users by username
const searchUsers = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      throw new ValidationError('Search query must be at least 2 characters long');
    }
    
    // Read users
    const users = await readData('users.json');
    
    // Find user
    const currentUser = findByUsername(users, username);
    if (!currentUser) {
      throw new NotFoundError('User not found');
    }
    
    // Search for users matching query
    const currentFriends = Array.isArray(currentUser.friends) ? currentUser.friends : [];
    const searchResults = users
      .filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) &&
        user.username !== username // Exclude current user
      )
      .map(user => ({
        username: user.username,
        wallet: parseFloat(user.wallet.toFixed(2)),
        isFriend: currentFriends.includes(user.username)
      }))
      .slice(0, 10); // Limit results
    
    res.json({
      username,
      query,
      results: searchResults,
      total: searchResults.length
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFriends,
  addFriend,
  removeFriend,
  searchUsers
};
