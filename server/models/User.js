const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    subscriptionPlan: {
      type: String,
      enum: ['Basic', 'Standard', 'Premium'],
      default: 'Basic',
    },
    isBanned: {
      type: Boolean,
      default: false, // ✅ new field for ban/unban logic
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
