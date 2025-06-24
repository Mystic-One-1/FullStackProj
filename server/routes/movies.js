const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');



const {
  getAllMovies,
  getMovieById,
  addMovie,
  deleteMovie,
  addMovieFromTmdb 
} = require('../controllers/movieController');



// ✅ Public: Get all movies
router.get('/', getAllMovies);

// ✅ Admin: Add a movie from TMDb by TMDb ID (must be before '/:id')
router.post('/tmdb', verifyToken, adminOnly, addMovieFromTmdb); // ✅ This must come BEFORE '/:id'

// ✅ Public: Get movie by ID
router.get('/:id', getMovieById);

// ✅ Admin: Add a new custom movie manually
router.post('/', verifyToken, adminOnly, addMovie);

// ✅ Admin: Delete movie by ID
router.delete('/:id', verifyToken, adminOnly, deleteMovie);

module.exports = router;
