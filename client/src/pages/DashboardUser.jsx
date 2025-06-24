// src/pages/DashboardUser.jsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import API from '../services/api';
import './DashboardUser.css';
import ThemeToggle from '../components/ThemeToggle';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const DashboardUser = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const carouselRef = useRef(null);
  const [currentIdx, setCurrentIdx] = useState(0);

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

  const addToWatchlist = async (movieId, e) => {
    e.stopPropagation();
    try {
      await API.post(`/users/watchlist/add/${movieId}`);
      toast.success('Added to watchlist');
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      toast.error('Failed to add to watchlist');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const featured = React.useMemo(() => {
    if (!movies.length) return [];
    const copy = [...movies];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, 5);
  }, [movies]);

  useEffect(() => {
    if (!featured.length) return;
    const interval = setInterval(() => {
      setCurrentIdx((i) => (i + 1) % featured.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featured.length]);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container || !featured.length) return;
    const slide = container.children[currentIdx];
    if (slide) {
      container.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    }
  }, [currentIdx, featured]);

  const prevSlide = () => {
    setCurrentIdx((i) => (i - 1 + featured.length) % featured.length);
  };
  const nextSlide = () => {
    setCurrentIdx((i) => (i + 1) % featured.length);
  };

  return (
    <div className="home-container">
      <Navbar />
      <ThemeToggle />

      <h2>🎬 {user ? `Welcome, ${user.name}!` : 'Movie Catalog'}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p>No movies available. Admins can add some!</p>
      )}

      {!loading && featured.length > 0 && (
        <div className="featured-carousel-container">
          <button className="carousel-arrow left" onClick={prevSlide}>‹</button>
          <div className="featured-carousel" ref={carouselRef}>
            {featured.map((m) => (
              <div
                key={m._id}
                className="featured-card"
                onClick={() => navigate(`/movie/${m._id}`)}
              >
                <img src={m.posterUrl} alt={m.title} />
                <div
                  className="ribbon"
                  onClick={(e) => addToWatchlist(m._id, e)}
                  title="Add to Watchlist"
                >
                  ★
                </div>
                <div className="overlay">
                  <h4>{m.title}</h4>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-arrow right" onClick={nextSlide}>›</button>
        </div>
      )}

      <div className="movie-row">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <img
              className="movie-poster"
              src={movie.posterUrl}
              alt={movie.title}
              onClick={() => navigate(`/movie/${movie._id}`)}
              onError={(e) => (e.target.src = 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg')}
            />
            <div
              className="ribbon"
              onClick={(e) => addToWatchlist(movie._id, e)}
              title="Add to Watchlist"
            >
              ★
            </div>
            <div className="movie-info">
              <h3>{movie.title} ({movie.year})</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardUser;
