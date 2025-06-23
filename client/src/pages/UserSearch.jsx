import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import './UserSearch.css';

const UserSearch = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedId = userId.trim();
    if (!trimmedId) {
      setError('Please enter a User ID');
      return;
    }

    try {
      const res = await API.get(`/users/${trimmedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

        if (res.data && res.data._id) {
        if (res.data.role === 'admin') {
            setError('❌ Admin accounts cannot be accessed here.');
        } else {
            navigate(`/admin/users/${trimmedId}`);
        }
        } else {
        setError('User not found');
        }

    } catch (err) {
      console.error(err);
      setError('User not found or error occurred');
    }
  };

  return (
    <div className="user-search-container">
      <h2>🔍 Search User by ID</h2>
      <form onSubmit={handleSearch} className="user-search-form">
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default UserSearch;
