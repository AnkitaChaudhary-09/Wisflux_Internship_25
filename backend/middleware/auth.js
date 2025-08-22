const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Authenticate request using Bearer token
function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      req.user = { id: decoded.id, username: decoded.username };
      next();
    });
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// Ensure the username in route params matches the authenticated user
function authorizeUserParam(req, res, next) {
  const { username } = req.params;
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (username && username !== req.user.username) {
    return res.status(403).json({ error: 'Forbidden: cannot access other user\'s data' });
  }
  next();
}

module.exports = { authenticateToken, authorizeUserParam };


