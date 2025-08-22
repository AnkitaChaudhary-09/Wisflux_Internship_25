const { readData, writeData, generateId, findByUsername } = require('../utils/dataManager');
const User = require('../models/User');
const { ValidationError, NotFoundError, ConflictError } = require('../middleware/errorHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function signToken(user) {
	return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN
	});
}

// User registration
const register = async (req, res, next) => {
  try {
    const { username, password, wallet = 0 } = req.body;
    
    // Read existing users
    const users = await readData('users.json');
    
    // Check if username already exists
    if (findByUsername(users, username)) {
      throw new ConflictError('Username already exists');
    }
    
    // Create new user
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      id: generateId(users),
      username,
      password: passwordHash,
      wallet: parseFloat(wallet) || 0.00
    });
    

    
    // Add to users array (persist plain object, not class instance)
    users.push({
      id: newUser.id,
      username: newUser.username,
      password: newUser.password,
      wallet: newUser.wallet,
      friends: newUser.friends,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    });
    
    // Save to file
    await writeData('users.json', users);
    
    // Issue JWT token
    const token = signToken(newUser);
    // Return user data (without password)
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: new User(newUser).safeJSON()
    });
    
  } catch (error) {
    next(error);
  }
};

// User login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Read users
    const users = await readData('users.json');
    
    // Find user
    const user = findByUsername(users, username);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Compare password (support both hashed and legacy plain)
    let isValid = false;
    if (user.password && user.password.startsWith('$2')) {
      isValid = await bcrypt.compare(password, user.password);
    } else {
      isValid = user.password === password;
    }
    if (!isValid) {
      throw new ValidationError('Invalid password');
    }

    const userModel = new User(user);
    const token = signToken(userModel);
    
    res.json({
      message: 'Login successful',
      token,
      user: userModel.safeJSON()
    });
    
  } catch (error) {
    next(error);
  }
};

// Get user profile
const getProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    // Read users
    const users = await readData('users.json');
    
    // Find user
    const user = findByUsername(users, username);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Return user data (without password)
    res.json({
      user: new User(user).toJSON()
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
};
