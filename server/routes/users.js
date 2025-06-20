const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User'); // ✅ import User model

// ✅ Protected: Full user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ user }); // will include name, email, role, subscriptionPlan, etc.
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Public test route
router.get('/test', (req, res) => {
  res.send('✅ Public user route working');
});

module.exports = router;
