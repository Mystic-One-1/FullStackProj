import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Landing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const trendingMovies = [
    { title: 'Stranger Things', poster: 'https://i.imgur.com/ZXBtVw7.jpg' },
    { title: 'Breaking Bad', poster: 'https://i.imgur.com/ZmC1f5N.jpg' },
    { title: 'The Dark Knight', poster: 'https://i.imgur.com/3fJ1P48.jpg' },
  ];

  return (
    <>
      <Navbar />
      <div className="landing">
        <h1 className="title">🎬 Welcome to <span className="highlight">StreamVerse</span></h1>
        <p className="subtitle">Binge your favorite movies & shows in style</p>

        <div className="buttons">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>

        <h2 className="section-title">🔥 Trending Now</h2>
        <div className="movie-grid">
          {trendingMovies.map((movie, i) => (
            <div key={i} className="movie-card">
              <img src={movie.poster} alt={movie.title} />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Landing;
