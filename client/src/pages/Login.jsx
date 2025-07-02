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
    console.log('🔐 Attempting login with:', { email, password });

    try {
      const res = await API.post('/auth/login', { email, password });
      const { accessToken, user } = res.data;

      if (user.role === 'admin') {
        toast.error('⚠️ Admins must use the /admin-login page');
        return;
      }

      if (login) {
        login(user, accessToken);
        toast.success('✅ Login successful!');
        navigate(from, { replace: true });
      } else {
        toast.error('⚠️ Login context not available');
      }
    } catch (err) {
      console.error('❌ Login error:', err);

      let message = '❌ Invalid email or password';

      if (err.response) {
        const data = err.response.data;
        console.warn('📥 Backend response error:', data);

        if (typeof data === 'string') {
          message = data;
        } else if (typeof data === 'object') {
          message = data.msg || data.message || data.error || message;
        }
      } else if (err.message) {
        message = err.message;
      }

      alert('Login Failed: Wrong Password or Email');

      toast.error(message, {
        position: 'top-center',
        autoClose: 4000,
        pauseOnHover: true,
      });
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
