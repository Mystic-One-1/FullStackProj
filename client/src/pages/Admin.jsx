import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Admin = () => {
  const [form, setForm] = useState({
    title: '',
    genre: '',
    year: '',
    rating: '',
    synopsis: '',
    posterUrl: '',
    trailerUrl: '',
    videoUrl: '',
  });

  const [jsonInput, setJsonInput] = useState('');
  const [movies, setMovies] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload;

      if (jsonInput.trim()) {
        try {
          payload = JSON.parse(jsonInput);

          // Detect array or single object
          if (Array.isArray(payload)) {
            for (let movie of payload) {
              await API.post('/movies', movie);
            }
            alert(`✅ ${payload.length} movies added successfully!`);
          } else {
            await API.post('/movies', payload);
            alert('✅ Movie added from JSON!');
          }
        } catch (err) {
          return alert('❌ Invalid JSON format');
        }
      } else {
        await API.post('/movies', form);
        alert('✅ Movie added from form!');
      }

      // Reset
      setForm({
        title: '',
        genre: '',
        year: '',
        rating: '',
        synopsis: '',
        posterUrl: '',
        trailerUrl: '',
        videoUrl: '',
      });
      setJsonInput('');
      fetchMovies();
    } catch (err) {
      alert(err?.response?.data?.msg || '❌ Failed to add movie');
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await API.get('/movies');
      setMovies(res.data);
    } catch (err) {
      console.error('❌ Error fetching movies:', err);
    }
  };

  const deleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await API.delete(`/movies/${id}`);
      fetchMovies();
    } catch (err) {
      alert('❌ Delete failed');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎬 Admin Dashboard</h2>

      <form onSubmit={handleSubmit}>
        <h3>➕ Add Movie (Form or JSON)</h3>

        {Object.keys(form).map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              width: '100%',
              padding: '0.5rem',
            }}
          />
        ))}

        <textarea
          placeholder="📥 Paste movie JSON (single or array)"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={10}
          style={{
            width: '100%',
            marginBottom: '1rem',
            padding: '0.5rem',
            fontFamily: 'monospace',
            resize: 'vertical',
          }}
        />

        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          🚀 Submit
        </button>
      </form>

      <hr style={{ margin: '2rem 0' }} />
      <h3>🎞️ Current Movies</h3>
      {movies.length === 0 ? (
        <p>No movies yet.</p>
      ) : (
        movies.map((movie) => (
          <div key={movie._id} style={{ marginBottom: '1rem' }}>
            <strong>{movie.title}</strong>
            <button
              onClick={() => deleteMovie(movie._id)}
              style={{ marginLeft: '1rem', color: 'red' }}
            >
              ❌ Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Admin;
