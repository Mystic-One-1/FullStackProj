const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String },
  year: { type: Number },
  rating: { type: String },
  synopsis: { type: String },
  posterUrl: { type: String },     // External image URL
  trailerUrl: { type: String },    // Optional YouTube/MP4 link
  videoUrl: { type: String },      // Streaming URL (e.g., HLS/MP4)
  tmdbId: { type: Number, required: true, unique: true },  // Unique TMDb ID
}, { timestamps: true });

// Create unique index on tmdbId to prevent duplicates
MovieSchema.index({ tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Movie', MovieSchema);
