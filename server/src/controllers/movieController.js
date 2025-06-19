const Movie = require('../models/Movie');

exports.list = async (req, res) => {
  const { genre, title, year, rating } = req.query;
  const query = {};
  if (genre) query.genre = { $in: [genre] };
  if (title) query.title = { $regex: title, $options: 'i' };
  if (year) query.year = Number(year);
  if (rating) query.rating = { $gte: Number(rating) };
  const movies = await Movie.find(query);
  res.json(movies);
};

exports.detail = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ error: 'Not found' });
  res.json(movie);
};
