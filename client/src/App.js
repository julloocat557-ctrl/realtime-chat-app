import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import ChatWindow from './components/ChatWindow';
import UserList from './components/UserList';
import Notifications from './components/Notifications';
import Navbar from './components/Navbar';

const socket = io('http://localhost:5000');

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Listen for active users update
    socket.on('active_users_update', (users) => {
      setActiveUsers(users);
    });

    // Listen for notifications
    socket.on('notification', (notification) => {
      setNotifications(prev => [...prev, notification]);
      playNotificationSound();
    });

    // Listen for messages
    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for user status changes
    socket.on('user_status_changed', (statusData) => {
      console.log(`User ${statusData.username} is now ${statusData.status}`);
    });

    return () => {
      socket.off('active_users_update');
      socket.off('notification');
      socket.off('receive_message');
      socket.off('user_status_changed');
    };
  }, []);

  const handleLogin = (userId, username, avatar) => {
    setCurrentUser({ userId, username, avatar });
    setIsLoggedIn(true);
    socket.emit('user_join', { userId, username, avatar });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setSelectedUser(null);
  };

  const playNotificationSound = () => {
    // Simple beep notification
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Navbar user={currentUser} onLogout={handleLogout} />
      <div className="app-container">
        <div className="sidebar">
          <Notifications notifications={notifications} />
          <UserList
            users={activeUsers}
            currentUser={currentUser}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        </div>
        <div className="main-content">
          {selectedUser ? (
            <ChatWindow
              currentUser={currentUser}
              selectedUser={selectedUser}
              socket={socket}
              messages={messages}
            />
          ) : (
            <div className="welcome-screen">
              <h2>Welcome to Chat App! 👋</h2>
              <p>Select a user from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('👤');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      const userId = `user_${Date.now()}`;
      onLogin(userId, username, avatar);
    }
  };

  const avatars = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧔', '👨‍🦰', '👩‍🦰'];

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>💬 Chat App</h1>
        <p>Connect and communicate with friends</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="avatar-selector">
            <p>Choose your avatar:</p>
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
          <button type="submit" className="login-btn">Enter Chat</button>
        </form>
      </div>
    </div>
  );
}

export default App;
