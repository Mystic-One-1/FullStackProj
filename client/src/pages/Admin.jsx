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
  const [movies, setMovies] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/movies', form);
      alert('Movie added!');
      fetchMovies();
    } catch (err) {
      alert(err?.response?.data?.msg || 'Failed to add movie');
    }
  };

  const fetchMovies = async () => {
    const res = await API.get('/movies');
    setMovies(res.data);
  };

  const deleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await API.delete(`/movies/${id}`);
      fetchMovies();
    } catch (err) {
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>
      <h2>🎬 Admin Dashboard</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(form).map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            required
            style={{ display: 'block', marginBottom: '0.5rem' }}
          />
        ))}
        <button type="submit">Add Movie</button>
      </form>

      <hr />
      <h3>Current Movies</h3>
      {movies.map((movie) => (
        <div key={movie._id} style={{ marginBottom: '1rem' }}>
          <strong>{movie.title}</strong>
          <button onClick={() => deleteMovie(movie._id)} style={{ marginLeft: '1rem' }}>
            ❌ Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Admin;
