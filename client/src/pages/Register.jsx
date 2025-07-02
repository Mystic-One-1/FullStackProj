import React, { useState } from 'react';
import API from '../services/api'; // ✅ use shared axios instance

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validatePassword = (pwd) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/;
    return regex.test(pwd);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      alert(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    try {
      await API.post('/auth/register', {
        name,
        email,
        password,
      });
      alert('Registered successfully! Please log in.');
      window.location.href = '/login';
    } catch (err) {
      alert(err?.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Full Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
