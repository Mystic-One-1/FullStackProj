const Movie = require('../models/Movie');

// GET all movies
exports.getAllMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
};

// GET movie by ID
exports.getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ msg: 'Movie not found' });
  res.json(movie);
};

// POST create a movie (admin)
exports.addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ msg: 'Error adding movie', error: err.message });
  }
};

// DELETE a movie (admin)
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Delete failed' });
  }
};
