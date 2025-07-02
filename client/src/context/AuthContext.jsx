import React, { createContext, useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Indicates profile sync in progress

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);

      try {
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.warn('Corrupted user data in localStorage');
        localStorage.removeItem('user');
      }

      const fetchProfile = async () => {
        try {
          const res = await API.get('/users/profile', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          setUser(res.data.user); // ✅ Sync with latest profile
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } catch (err) {
          const msg = err?.response?.data?.msg;

          if (msg === '🚫 You are banned from using this site') {
            toast.error('🚫 You are banned from using this site');
          } else {
            toast.error('⚠️ Session expired or unauthorized');
          }

          logout();
        } finally {
          setLoading(false); // ✅ Done syncing
        }
      };

      fetchProfile();
    } else {
      setLoading(false); // ✅ No token, done
    }
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', jwtToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,     // ✅ Can be used in Profile/Watchlist/etc
        setUser,
        setToken,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
