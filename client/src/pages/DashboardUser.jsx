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
      alert('🎉 Added to Watchlist');
    } catch (err) {
      alert('❌ Failed to add to watchlist');
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

      {user && <h2 style={{ marginBottom: '1rem' }}>🎬 Welcome, {user.name}!</h2>}
      {!user && <h2 style={{ marginBottom: '1rem' }}>🎬 Movie Catalog</h2>}

      {loading && <p>Loading movies...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {movies.length === 0 && !loading && !error && (
        <p>No movies available. Admins can add some!</p>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            className="movie-card"
            key={movie._id}
            style={{ cursor: 'pointer' }}
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
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Rating:</strong> {movie.rating}</p>
              <p>{movie.synopsis}</p>
              <button
                onClick={() => addToWatchlist(movie._id)}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.3rem 1rem',
                  cursor: 'pointer',
                  backgroundColor: '#444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
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
