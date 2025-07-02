// src/pages/DashboardUser.jsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import API from '../services/api';
import './DashboardUser.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle'; // 🌙 Theme toggle
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
  const [watchlistMovies, setWatchlistMovies] = useState(new Set());
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

  const fetchWatchlist = async () => {
    try {
      const res = await API.get('/users/watchlist');
      const watchlistIds = new Set(res.data.map(movie => movie._id));
      setWatchlistMovies(watchlistIds);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    }
  };

  const addToWatchlist = async (movieId, e, movieTitle = '') => {
    e.stopPropagation();
    try {
      if (watchlistMovies.has(movieId)) {
        await API.delete(`/users/watchlist/remove/${movieId}`);
        setWatchlistMovies(prev => {
          const newSet = new Set(prev);
          newSet.delete(movieId);
          return newSet;
        });
        toast.success(`${movieTitle || 'Movie'} removed from watchlist`);
      } else {
        await API.post(`/users/watchlist/add/${movieId}`);
        setWatchlistMovies(prev => new Set(prev).add(movieId));
        toast.success(`${movieTitle || 'Movie'} added to watchlist`);
      }
    } catch (err) {
      console.error('Error updating watchlist:', err);
      toast.error('Failed to update watchlist');
    }
  };

  useEffect(() => {
    fetchMovies();
    if (user) fetchWatchlist();
  }, [user]);

  useEffect(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return setFilteredMovies([]);
    const matches = movies.filter(movie =>
      movie.title.toLowerCase().includes(search)
    );
    setFilteredMovies(matches);
  }, [searchTerm, movies]);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      const titlesToFetch = filteredMovies
        .filter(m => !tmdbDetailsMap[m.title])
        .map(m => m.title);

      const uniqueTitles = [...new Set(titlesToFetch)];
      for (const title of uniqueTitles) {
        const tmdbData = await fetchTmdbDetails(title, TMDB_API_KEY);
        if (tmdbData) {
          setTmdbDetailsMap(prev => ({ ...prev, [title]: tmdbData }));
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
      setCurrentIdx(i => (i + 1) % featured.length);
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

  return (
    <div className="home-container">
      <Navbar />

      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
        <ThemeToggle />
      </div>

      <h2 className="sticky-heading">🎬 {user ? `Welcome, ${user.name}!` : 'Movie Catalog'}</h2>

      <input
        type="text"
        placeholder="🔍 Search movies in library..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="tmdb-search-input"
      />

      {searchTerm && (
        <div className="tmdb-results">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => {
              const tmdb = tmdbDetailsMap[movie.title];
              const isInWatchlist = watchlistMovies.has(movie._id);
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
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/200x300')}
                  />
                  <div
                    className={`ribbon ${isInWatchlist ? 'in-watchlist' : ''}`}
                    onClick={(e) => addToWatchlist(movie._id, e, movie.title)}
                    title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
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
          <div className="featured-carousel" ref={carouselRef}>
            {featured.map((m) => {
              const isInWatchlist = watchlistMovies.has(m._id);
              return (
                <div
                  key={m._id}
                  className="featured-card"
                  onClick={() => navigate(`/movie/${m._id}`)}
                >
                  <img src={m.posterUrl} alt={m.title} />
                  <div
                    className={`ribbon ${isInWatchlist ? 'in-watchlist' : ''}`}
                    onClick={(e) => addToWatchlist(m._id, e, m.title)}
                    title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                  >
                    ★
                  </div>
                  <div className="overlay">
                    <h4>{m.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!searchTerm && (
        <div className="movie-row">
          {movies.map((movie) => {
            const isInWatchlist = watchlistMovies.has(movie._id);
            return (
              <div key={movie._id} className="movie-card">
                <img
                  className="movie-poster"
                  src={movie.posterUrl}
                  alt={movie.title}
                  onClick={() => navigate(`/movie/${movie._id}`)}
                  onError={(e) =>
                    (e.target.src = 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg')
                  }
                />
                <div
                  className={`ribbon ${isInWatchlist ? 'in-watchlist' : ''}`}
                  onClick={(e) => addToWatchlist(movie._id, e, movie.title)}
                  title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                >
                  ★
                </div>
                <div className="movie-info">
                  <h3>{movie.title} ({movie.year})</h3>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardUser;
