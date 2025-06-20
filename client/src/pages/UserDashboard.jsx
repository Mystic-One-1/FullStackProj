import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      <ThemeToggle />
      <h2 style={{ marginBottom: '1rem' }}>
        🎉 Welcome, {user?.name || user?.email?.split('@')[0]}!
      </h2>
      <p>Your current plan: <strong>{user?.plan}</strong></p>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/">🏠 Back to Public Home</Link>
      </div>
    </div>
  );
};

export default UserDashboard;
