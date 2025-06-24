const adminOnly = (req, res, next) => {
  // Check if req.user exists and has a role
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: Admins only' });
  }

  next();
};

module.exports = adminOnly;
