import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Login.css';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      const { accessToken, user } = res.data;

      if (user.role === 'admin') {
        toast.error('⚠️ Admins must use the /admin-login page');
        return;
      }

      if (login) {
        login(user, accessToken); // use context login function
        toast.success('✅ Login successful!');
        navigate(from, { replace: true });
      } else {
        toast.error('⚠️ Login context not available');
      }
    } catch (err) {
      toast.error(err?.response?.data?.msg || '❌ Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2>🔐 Login</h2>
      <input
        type="email"
        placeholder="📧 Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="🔑 Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">🚀 Login</button>
    </form>
  );
};

export default Login;
