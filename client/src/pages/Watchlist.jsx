// src/pages/Watchlist.jsx
import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const { user, token } = useContext(AuthContext);
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
    <div style={{ padding: '1rem' }}>
      <Navbar />
      <h2>📺 My Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>No movies in your watchlist yet.</p>
      ) : (
        <div className="movie-grid">
          {watchlist.map((movie) => (
            <div key={movie._id} className="movie-card" style={{ textAlign: 'center' }}>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                style={{ width: '150px', height: '225px', objectFit: 'cover' }}
              />
              <div>
                <h4>{movie.title}</h4>
                <p>{movie.genre} • {movie.year}</p>
                <button onClick={() => navigate(`/movie/${movie._id}`)} style={{ marginRight: '0.5rem' }}>
                  ▶️ Watch
                </button>
                <button onClick={() => removeFromWatchlist(movie._id)} style={{ color: 'red' }}>
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
