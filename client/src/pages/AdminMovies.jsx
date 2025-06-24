import React, { useState, useContext, useEffect } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AdminMovies.css';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const AdminMovies = () => {
  const { token } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const delay = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(delay);
  }, [query]);

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
        console.error(err);
        toast.error('❌ TMDb search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const addMovieToDB = async (movie) => {
    try {
      const movieData = {
        title: movie.title,
        genre: movie.genre_ids.join(', '),
        year: movie.release_date?.slice(0, 4),
        rating: movie.vote_average,
        synopsis: movie.overview,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        trailerUrl: '',
        videoUrl: ''
      };

      await API.post('/movies', movieData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`✅ Added "${movie.title}"`);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to add movie');
    }
  };

  return (
    <div className="admin-movie-manager">
      <h2>🎬 Search TMDb & Add Movie</h2>

      <div className="search-form">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </div>

      {loading && <p style={{ color: '#ccc', textAlign: 'center' }}>🔍 Searching...</p>}

      {!loading && debouncedQuery && results.length === 0 && (
        <p style={{ color: '#999', textAlign: 'center', marginTop: '1rem' }}>
          ❌ No results found for "<strong>{debouncedQuery}</strong>"
        </p>
      )}

      <div className="movie-results">
        {results.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
            <h4>{movie.title} ({movie.release_date?.slice(0, 4)})</h4>
            <p>{movie.overview?.slice(0, 100)}...</p>
            <button onClick={() => addMovieToDB(movie)}>➕ Add</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMovies;
