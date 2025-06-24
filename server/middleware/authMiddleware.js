const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expecting format: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(403).json({ msg: 'Forbidden: Token is malformed' });
    }

    req.user = decoded; // Attach decoded user info (id, role) to the request
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(403).json({ msg: 'Forbidden: Invalid or expired token' });
  }
};

module.exports = verifyToken;
