const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');

// ✅ Protected: Full user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Public test route
router.get('/test', (req, res) => {
  res.send('✅ Public user route working');
});

// ✅ Add to watchlist
router.post('/watchlist/add/:movieId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const movieId = req.params.movieId;

    if (!user.watchlist.includes(movieId)) {
      user.watchlist.push(movieId);
      await user.save();
    }

    res.json({ msg: 'Movie added to watchlist', watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ❌ Remove from watchlist
router.delete('/watchlist/remove/:movieId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const movieId = req.params.movieId;

    user.watchlist = user.watchlist.filter(id => id.toString() !== movieId);
    await user.save();

    res.json({ msg: 'Movie removed from watchlist', watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// 📄 Get watchlist (populated with movie data)
router.get('/watchlist', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('watchlist');
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// 👥 Get all users — **admin only**
router.get('/all', verifyToken, async (req, res) => {
  try {
    // only admins may access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const users = await User.find()
      .select('-password')       // exclude passwords
      .sort({ createdAt: -1 });  // newest first

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
