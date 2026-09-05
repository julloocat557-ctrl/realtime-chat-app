import React from 'react';
import './Navbar.css';

function Navbar({ user, onLogout, theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-brand">💬 ChatApp</h1>
      </div>
      {user && (
        <div className="navbar-right">
          <div className="user-info">
            <span className="user-avatar">{user.avatar}</span>
            <span className="user-name">{user.username}</span>
            <span className="status-dot"></span>
          </div>
          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
