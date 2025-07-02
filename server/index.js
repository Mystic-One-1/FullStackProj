const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend access
  credentials: true,
}));
app.use(express.json()); // Parse JSON body

// ✅ Serve static videos (for different plans)
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

// ✅ Mount API routes
app.use('/api/auth', authRoutes);
console.log('✅ /api/auth routes mounted');

app.use('/api/users', userRoutes);
console.log('✅ /api/users routes mounted');

app.use('/api/movies', movieRoutes);
console.log('✅ /api/movies routes mounted');

// ✅ Basic root route
app.get('/', (req, res) => {
  res.send('🎬 Netflix Clone Backend Running!');
});

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
});
