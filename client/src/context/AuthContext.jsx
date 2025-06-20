import React, { createContext, useEffect, useState } from 'react';
import API from '../services/api';

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
          setUser(res.data.user); // Sync fresh profile
        } catch (err) {
          console.log('Not logged in or token expired');
          setUser(null);
        }
      };

      fetchProfile();
    }
  }, []);

  // ✅ Logout Function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    window.location.href = '/'; // Or use navigate('/login') if you're inside a component
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
