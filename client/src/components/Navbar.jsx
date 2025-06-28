import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="navbar">
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
        <Link to="/" className="brand">🎥 StreamVerse</Link>
      </nav>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <button className="close-btn" onClick={toggleSidebar}>×</button>
          {user ? (
            <>
              <Link to="/dashboard" onClick={toggleSidebar}>Dashboard</Link>
              <Link to="/watchlist" onClick={toggleSidebar}>📺 My Watchlist</Link>
              <Link to="/profile" onClick={toggleSidebar}>Profile</Link>
              <button onClick={() => { toggleSidebar(); handleLogout(); }} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleSidebar}>Login</Link>
              <Link to="/register" onClick={toggleSidebar}>Register</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
