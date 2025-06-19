const Watchlist = require('../models/Watchlist');

exports.getWatchlist = async (req, res) => {
  const watchlist = await Watchlist.findOne({ user: req.user.id }).populate('movies');
  if (!watchlist) return res.json({ movies: [] });
  res.json(watchlist);
};

exports.add = async (req, res) => {
  const { movieId } = req.body;
  let watchlist = await Watchlist.findOne({ user: req.user.id });
  if (!watchlist) {
    watchlist = await Watchlist.create({ user: req.user.id, movies: [movieId] });
  } else if (!watchlist.movies.includes(movieId)) {
    watchlist.movies.push(movieId);
    await watchlist.save();
  }
  res.json(watchlist);
};

exports.remove = async (req, res) => {
  const { movieId } = req.body;
  const watchlist = await Watchlist.findOne({ user: req.user.id });
  if (watchlist) {
    watchlist.movies = watchlist.movies.filter(m => m.toString() !== movieId);
    await watchlist.save();
  }
  res.json(watchlist);
};
