const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000', // restrict CORS to frontend only (optional)
  credentials: true,
}));
app.use(express.json()); // Parse incoming JSON

// ✅ Mount routes
app.use('/api/auth', authRoutes);
console.log('✅ /api/auth routes mounted');

app.use('/api/users', userRoutes);
console.log('✅ /api/users routes mounted');

app.use('/api/movies', movieRoutes);
console.log('✅ /api/movies routes mounted');

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🎬 Netflix Clone Backend Running!');
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});



//hello 