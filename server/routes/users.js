const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/User');

// ✅ Get logged-in user's profile
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

// ✅ Remove from watchlist
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

// ✅ Get full watchlist (populated with movie details)
router.get('/watchlist', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('watchlist');
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Get all users (admin only)
router.get('/all', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Get single user by ID (admin only)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Toggle ban/unban (admin only)
router.patch('/ban/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ msg: `User ${user.isBanned ? 'banned' : 'unbanned'}` });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Delete user (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted permanently' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
