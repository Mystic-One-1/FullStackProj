// src/pages/Landing.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'; // Optional: add some public styles

const Landing = () => {
  return (
    <div className="landing-container">
      <h1>🍿 Welcome to MovieHub!</h1>
      <p>Stream your favorite movies with flexible plans:</p>

      <ul>
        <li><strong>Basic:</strong> 480p quality</li>
        <li><strong>Standard:</strong> 720p HD</li>
        <li><strong>Premium:</strong> 1080p + multi-device support</li>
      </ul>

      <div style={{ marginTop: '1rem' }}>
        <Link to="/login">🔐 Sign In</Link> | <Link to="/register">📝 Register</Link>
      </div>
    </div>
  );
};

export default Landing;
