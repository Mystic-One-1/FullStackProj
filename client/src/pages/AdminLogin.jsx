import React, { useState, useContext } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext); // ✅ get setUser from context
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });

      if (res.data.user.role !== 'admin') {
        alert('Access denied. Admins only.');
        return;
      }

      // ✅ Update storage and context
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user); // ✅ this triggers ProtectedRoute correctly

      alert('Admin login successful!');
      navigate('/admin');
    } catch (err) {
      alert(err?.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleAdminLogin}>
      <h2>Admin Login</h2>
      <input
        placeholder="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login as Admin</button>
    </form>
  );
};

export default AdminLogin;
