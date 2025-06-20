import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import './Dashboard_user.css';
import ThemeToggle from '../components/ThemeToggle';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext); // ✅ get logout
  const navigate = useNavigate(); // for redirect

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

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to landing page
  };

  return (
    <div className="home-container">
      <ThemeToggle />
      <a href="/profile" style={{ color: 'skyblue', marginRight: '1rem' }}>
        My Profile
      </a>
      <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
        🚪 Logout
      </button>

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
            onClick={() => (window.location.href = `/movie/${movie._id}`)}
            style={{ cursor: 'pointer' }}
          >
            <img
              className="movie-poster"
              src={movie.posterUrl}
              alt={movie.title}
              onError={(e) =>
                (e.target.src =
                  'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?cs=srgb&dl=pexels-pixabay-56866.jpg&fm=jpg')
              }
            />
            <div className="movie-info">
              <h3>
                {movie.title} ({movie.year})
              </h3>
              <p>
                <strong>Genre:</strong> {movie.genre}
              </p>
              <p>
                <strong>Rating:</strong> {movie.rating}
              </p>
              <p>{movie.synopsis}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
