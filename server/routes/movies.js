const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const {
  getAllMovies,
  getMovieById,
  addMovie,
  deleteMovie
} = require('../controllers/movieController');

// Public routes
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

// Admin routes
router.post('/', verifyToken, adminOnly, addMovie);
router.delete('/:id', verifyToken, adminOnly, deleteMovie);

module.exports = router;
