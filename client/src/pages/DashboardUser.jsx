// src/pages/DashboardUser.jsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import API from '../services/api';
import './DashboardUser.css';
import ThemeToggle from '../components/ThemeToggle';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const fetchTmdbDetails = async (title, apiKey) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`
    );
    const data = await res.json();
    return data.results?.[0] || null;
  } catch (err) {
    console.error(`TMDb fetch failed for: ${title}`, err);
    return null;
  }
};

const DashboardUser = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [tmdbDetailsMap, setTmdbDetailsMap] = useState({});
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
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

  const addToWatchlist = async (movieId, e, movieTitle = '') => {
    e.stopPropagation();
    try {
      await API.post(`/users/watchlist/add/${movieId}`);
      toast.success(`${movieTitle || 'Movie'} added to watchlist`);
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      toast.error('Failed to add to watchlist');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) {
      setFilteredMovies([]);
      return;
    }

    const matches = movies.filter((movie) =>
      movie.title.toLowerCase().includes(search)
    );
    setFilteredMovies(matches);
  }, [searchTerm, movies]);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      const titlesToFetch = filteredMovies
        .filter((m) => !tmdbDetailsMap[m.title])
        .map((m) => m.title);

      const uniqueTitles = [...new Set(titlesToFetch)];

      for (const title of uniqueTitles) {
        const tmdbData = await fetchTmdbDetails(title, TMDB_API_KEY);
        if (tmdbData) {
          setTmdbDetailsMap((prev) => ({
            ...prev,
            [title]: tmdbData,
          }));
        }
      }
    };

    if (filteredMovies.length > 0) {
      const delay = setTimeout(() => {
        fetchBatchDetails();
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [filteredMovies, TMDB_API_KEY, tmdbDetailsMap]);

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

      <input
        type="text"
        placeholder="🔍 Search movies in library..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="tmdb-search-input"
      />

      {/* Search Results Section */}
      {searchTerm && (
        <div className="tmdb-results">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => {
              const tmdb = tmdbDetailsMap[movie.title];
              return (
                <div
                  key={movie._id}
                  className="tmdb-result-card"
                  onClick={() => navigate(`/movie/${movie._id}`)}
                >
                  <img
                    src={
                      tmdb?.poster_path
                        ? `https://image.tmdb.org/t/p/w200${tmdb.poster_path}`
                        : movie.posterUrl
                    }
                    alt={movie.title}
                    onError={(e) =>
                      (e.target.src = 'https://via.placeholder.com/200x300')
                    }
                  />
                  <div
                    className="ribbon"
                    onClick={(e) => addToWatchlist(movie._id, e, movie.title)}
                    title="Add to Watchlist"
                  >
                    ★
                  </div>
                  <div>
                    <h4>{movie.title}</h4>
                    <p>⭐ {tmdb?.vote_average || 'N/A'}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-results-msg">❌ Movie not found in the library.</p>
          )}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p>No movies available. Admins can add some!</p>
      )}

      {!searchTerm && !loading && featured.length > 0 && (
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
                  onClick={(e) => addToWatchlist(m._id, e, m.title)}
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

      {!searchTerm && (
        <div className="movie-row">
          {movies.map((movie) => (
            <div key={movie._id} className="movie-card">
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
              <div
                className="ribbon"
                onClick={(e) => addToWatchlist(movie._id, e, movie.title)}
                title="Add to Watchlist"
              >
                ★
              </div>
              <div className="movie-info">
                <h3>
                  {movie.title} ({movie.year})
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardUser;
