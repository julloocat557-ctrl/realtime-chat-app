import React from 'react';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>💬 Chat App</h1>
      </div>
      {user && (
        <div className="navbar-user">
          <span className="user-avatar">{user.avatar}</span>
          <span className="user-name">{user.username}</span>
          <span className="online-indicator"></span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
