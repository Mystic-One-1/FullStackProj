// src/pages/Watchlist.jsx
import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const { user, token } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const fetchWatchlist = async () => {
    try {
      const res = await API.get('/users/watchlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(res.data);
    } catch (err) {
      console.error('Failed to fetch watchlist', err);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await API.delete(`/users/watchlist/remove/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist((prev) => prev.filter((movie) => movie._id !== movieId));
    } catch (err) {
      console.error('Failed to remove from watchlist', err);
      alert('Failed to remove');
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div className={`watchlist-container ${darkMode ? 'dark' : 'light'}`}>
      <Navbar />
      <h2>📺 My Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>No movies in your watchlist yet.</p>
      ) : (
        <div className="movie-grid">
          {watchlist.map((movie) => (
            <div key={movie._id} className="movie-card">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="watchlist-poster"
                onClick={() => navigate(`/movie/${movie._id}`)}
                onError={(e) =>
                  (e.target.src =
                    'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg')
                }
              />
              <div className="movie-meta">
                <h4>{movie.title}</h4>
                <p>{movie.genre} • {movie.year}</p>
                <div className="watchlist-actions">
                  <button
                    className="watch-btn"
                    onClick={() => navigate(`/movie/${movie._id}`)}
                  >
                    ▶️ Watch
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromWatchlist(movie._id)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
