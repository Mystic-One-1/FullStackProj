import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'; // Optional for styling

const Landing = () => {
  return (
    <div className="landing-container">
      <h1>🎬 Welcome to MovieFlix</h1>
      <p>Stream your favorite movies in HD. Choose a plan and get started!</p>

      <div className="landing-buttons">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>

      <section className="plans-section">
        <h2>📦 Plans</h2>
        <ul>
          <li><strong>Basic:</strong> SD quality, 1 device</li>
          <li><strong>Standard:</strong> HD quality, 2 devices</li>
          <li><strong>Premium:</strong> Ultra HD, 4 devices</li>
        </ul>
      </section>

      <section className="trending-section">
        <h2>🔥 Trending Movies</h2>
        <p>(Sample section — dynamic listing can be added later)</p>
      </section>
    </div>
  );
};

export default Landing;
