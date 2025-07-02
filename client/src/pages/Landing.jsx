// src/pages/Landing.jsx

import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import bgImage from '../assets/landing_bg.jpg';

const Landing = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      <div
        className="landing"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
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
      </div>
    </>
  );
};

export default Landing;
