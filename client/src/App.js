import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ViewUsers from './pages/ViewUsers';
import Dashboard from './pages/DashboardUser';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import MoviePlayer from './pages/MoviePlayer';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import AdminLogin from './pages/AdminLogin';
import Watchlist from './pages/Watchlist'; // ✅ Add this line

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movie/:id" element={<MoviePlayer />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            <Route
              path="/watchlist"
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <ViewUsers />
                </ProtectedRoute>
              }
            />

          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
