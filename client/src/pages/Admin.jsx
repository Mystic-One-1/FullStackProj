// src/pages/Admin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h2>🎬 Admin Dashboard</h2>

      <div className="admin-cards">
        <div className="admin-card" onClick={() => navigate('/admin/users')}>
          👥 View Users
        </div>
        <div className="admin-card" onClick={() => navigate('/admin/movies')}>
          🎞️ Manage Movies
        </div>
        {/* <div className="admin-card" onClick={() => navigate('/admin/activity')}>
          📊 Recent Activity
        </div> */}
        <div className="admin-card" onClick={() => navigate('/')}>
          🏠 Go to Homepage
        </div>
      </div>
    </div>
  );
};

export default Admin;
