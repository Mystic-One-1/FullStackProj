// src/pages/Landing.jsx

import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Landing = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const trendingMovies = [
    { title: 'Stranger Things', poster: 'https://i.imgur.com/ZXBtVw7.jpg' },
    { title: 'Breaking Bad', poster: 'https://i.imgur.com/ZmC1f5N.jpg' },
    { title: 'The Dark Knight', poster: 'https://i.imgur.com/3fJ1P48.jpg' },
  ];

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <>
      <Navbar />
      <div className="landing">
        <h1 className="title">
          🎬 Welcome to <span className="highlight">StreamVerse</span>
        </h1>
        <p className="subtitle">Binge your favorite movies & shows in style</p>

        <div className="buttons">
          {!user ? (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          ) : (
            <div className="user-dropdown-wrapper" ref={dropdownRef}>
              <div className="user-display" onClick={handleToggleDropdown}>
                <div className="user-avatar">👤</div>
                <span className="user-name">{user.name}</span>
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/dashboard">Dashboard</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          )}
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
