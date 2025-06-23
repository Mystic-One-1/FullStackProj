// src/pages/DashboardUser.jsx
import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import './DashboardUser.css';
import ThemeToggle from '../components/ThemeToggle';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DashboardUser = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchMovies = async () => {
    try {
      const res = await API.get('/movies');
      setMovies(res.data);
    } catch (err) {
      setError('Failed to fetch movies.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movieId) => {
    try {
      await API.post(`/users/watchlist/add/${movieId}`);
      // you might replace this with a toast as we did earlier
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <ThemeToggle />

      {user ? (
        <h2>🎬 Welcome, {user.name}!</h2>
      ) : (
        <h2>🎬 Movie Catalog</h2>
      )}

      {loading && <p>Loading movies...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p>No movies available. Admins can add some!</p>
      )}

      <div className="movie-row">
        {movies.map((movie) => (
          <div
            className="movie-card"
            key={movie._id}
          >
            <img
              className="movie-poster"
              src={movie.posterUrl}
              alt={movie.title}
              onClick={() => navigate(`/movie/${movie._id}`)}
              onError={(e) =>
                (e.target.src =
                  'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg')
              }
            />
            <div className="movie-info">
              <h3>{movie.title} ({movie.year})</h3>
              <button
                className="watchlist-btn"
                onClick={() => addToWatchlist(movie._id)}
              >
                ➕ Add to Watchlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardUser;
