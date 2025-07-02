// src/components/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // ✅ use the hook
import './ThemeToggle.css'; // optional styling

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme(); // ✅ useTheme instead of useContext(ThemeContext)

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
