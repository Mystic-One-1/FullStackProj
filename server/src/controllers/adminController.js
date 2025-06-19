const User = require('../models/User');
const Movie = require('../models/Movie');

exports.listUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  res.json(user);
};

exports.addMovie = async (req, res) => {
  const movie = await Movie.create(req.body);
  res.json(movie);
};

exports.updateMovie = async (req, res) => {
  const { movieId } = req.params;
  const movie = await Movie.findByIdAndUpdate(movieId, req.body, { new: true });
  res.json(movie);
};

exports.deleteMovie = async (req, res) => {
  await Movie.findByIdAndDelete(req.params.movieId);
  res.json({ success: true });
};
