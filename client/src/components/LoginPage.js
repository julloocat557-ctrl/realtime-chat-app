import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLogin, theme, toggleTheme }) {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('👤');

  const avatars = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧔', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      const userId = `user_${Date.now()}`;
      onLogin(userId, username, avatar);
    }
  };

  return (
    <div className="login-page">
      <button className="theme-toggle-login" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className="login-container">
        <div className="login-header">
          <h1>💬 ChatApp</h1>
          <p>Connect and communicate instantly</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              maxLength="30"
              className="username-input"
            />
          </div>

          <div className="form-group">
            <label>Choose your avatar:</label>
            <div className="avatar-grid">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  className={`avatar-btn ${avatar === av ? 'selected' : ''}`}
                  onClick={() => setAvatar(av)}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="login-btn">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
