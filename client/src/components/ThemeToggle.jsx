import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        marginBottom: '1rem',
        padding: '0.5rem 1rem',
        background: 'none',
        border: '1px solid gray',
        color: darkMode ? '#fff' : '#111',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Switch to {darkMode ? 'Light' : 'Dark'} Mode
    </button>
  );
};

export default ThemeToggle;
