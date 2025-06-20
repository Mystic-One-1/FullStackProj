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
      setUser(JSON.parse(storedUser)); // ✅ Add this line
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

  return (
    <AuthContext.Provider value={{ user, token, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
