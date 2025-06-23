import React, { createContext, useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const fetchProfile = async () => {
        try {
          const res = await API.get('/users/profile', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setUser(res.data.user); // Sync latest user info
        } catch (err) {
          const msg = err?.response?.data?.msg;

          if (msg === '🚫 You are banned from using this site') {
            toast.error('🚫 You are banned from using this site');
          } else {
            toast.error('⚠️ Session expired or unauthorized');
          }

          setUser(null);
          setToken(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      };

      fetchProfile();
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
