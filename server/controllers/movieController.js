const axios = require('axios');
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

// ✅ POST Add movie from TMDb
exports.addMovieFromTmdb = async (req, res) => {
  const { tmdbId } = req.body;
  if (!tmdbId) return res.status(400).json({ msg: 'tmdbId is required' });

  try {
    const tmdbRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=videos`
    );

    const data = tmdbRes.data;

    const movie = {
      title: data.title,
      genre: data.genres.map((g) => g.name).join(', '),
      year: parseInt(data.release_date?.split('-')[0]) || null,
      rating: data.vote_average,
      synopsis: data.overview,
      posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      trailerUrl: data.videos?.results?.find((v) => v.type === 'Trailer')?.key
        ? `https://www.youtube.com/watch?v=${data.videos.results.find((v) => v.type === 'Trailer').key}`
        : '',
      videoUrl: '' // You can update this manually or later
    };

    const saved = await Movie.create(movie);
    res.status(201).json({ msg: '✅ Movie added from TMDb', movie: saved });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ msg: '❌ Failed to fetch from TMDb or save' });
  }
};
