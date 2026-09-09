const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ridesync_super_secret_jwt_token_key_2026';

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No authentication token provided. Access denied.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token. Access denied.' });
  }
};

module.exports = authMiddleware;
