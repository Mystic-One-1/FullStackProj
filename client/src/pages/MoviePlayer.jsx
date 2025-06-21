import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

const MoviePlayer = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await API.get(`/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error('Failed to fetch movie', err);
        setError('Movie not found.');
      }
    };
    fetchMovie();
  }, [id]);

  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!movie) return <p style={{ textAlign: 'center' }}>Loading movie...</p>;

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🎬 Now Playing: {movie.title}</h2>
      <video width="640" height="360" controls autoPlay>
        <source src={movie.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>{movie.synopsis}</p>
    </div>
  );
};

export default MoviePlayer;
