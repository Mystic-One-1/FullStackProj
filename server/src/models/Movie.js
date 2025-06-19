const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  genre: [String],
  year: Number,
  rating: Number,
  poster: String,
  trailer: String,
  synopsis: String
});

module.exports = mongoose.model('Movie', movieSchema);
