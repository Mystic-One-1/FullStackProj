// src/pages/AdminMovies.jsx
import React, { useState, useContext, useEffect } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AdminMovies.css';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Static TMDb genre ID → name mapping
const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

const AdminMovies = () => {
  const { token } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [addedMoviesMap, setAddedMoviesMap] = useState({});
  const [addedMovies, setAddedMovies] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch existing movies (tmdbId → MongoDB _id) from backend
  useEffect(() => {
    const fetchAdded = async () => {
      try {
        const { data } = await API.get('/movies', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const map = {};
        data.forEach((m) => {
          if (m.tmdbId) map[m.tmdbId] = m._id;
        });
        setAddedMoviesMap(map);
        setAddedMovies(new Set(Object.keys(map).map((id) => parseInt(id, 10))));
      } catch (err) {
        toast.error('Error fetching added movies');
        console.error(err);
      }
    };
    if (token) fetchAdded();
  }, [token]);

  // Fetch TMDb search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) return setResults([]);
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        toast.error('Failed to fetch movies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleAdd = async (movie) => {
    try {
      // Map genre_ids to names
      const genreNames = (movie.genre_ids || []).map(
        (id) => genreMap[id] || 'Unknown'
      );

      const payload = {
        title: movie.title,
        genre: genreNames.join(', '),
        year: movie.release_date ? parseInt(movie.release_date.split('-')[0], 10) : null,
        rating: movie.vote_average?.toString() || '',
        synopsis: movie.overview || '',
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '',
        trailerUrl: '',
        videoUrl: '',
        tmdbId: movie.id,
      };

      const { data } = await API.post('/movies', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local maps
      setAddedMoviesMap((prev) => ({ ...prev, [movie.id]: data._id }));
      setAddedMovies((prev) => new Set(prev).add(movie.id));
      toast.success('Movie added');
    } catch (err) {
      toast.error('Error adding movie');
      console.error(err);
    }
  };

  const handleRemove = async (movie) => {
    try {
      const mongoId = addedMoviesMap[movie.id];
      if (!mongoId) return toast.error('Movie not found in database');

      await API.delete(`/movies/${mongoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local maps
      setAddedMoviesMap((prev) => {
        const next = { ...prev };
        delete next[movie.id];
        return next;
      });
      setAddedMovies((prev) => {
        const next = new Set(prev);
        next.delete(movie.id);
        return next;
      });

      toast.info('Movie removed');
    } catch (err) {
      toast.error('Error removing movie');
      console.error(err);
    }
  };

  return (
    <div className="admin-movies-container">
      <h2>Search & Manage Movies</h2>
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar"
      />

      {loading && <p>Loading...</p>}
      {!loading && !results.length && debouncedQuery && <p>No results found.</p>}

      <div className="movie-results">
        {results.map((movie) => {
          const isAdded = addedMovies.has(movie.id);
          return (
            <div key={movie.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <h4>{movie.title}</h4>
              <p>{movie.release_date}</p>
              <p className="genre-names">
                {(movie.genre_ids || [])
                  .map((id) => genreMap[id])
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {isAdded ? (
                <button onClick={() => handleRemove(movie)} className="remove-btn">
                  Remove
                </button>
              ) : (
                <button onClick={() => handleAdd(movie)} className="add-btn">
                  Add
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminMovies;
