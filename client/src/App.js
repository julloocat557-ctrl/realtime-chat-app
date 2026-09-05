import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import ChatWindow from './components/ChatWindow';
import UserList from './components/UserList';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';

const socket = io('http://localhost:5000');

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme === 'dark' ? 'dark-mode' : '';

    // Listen for active users update
    socket.on('active_users_update', (users) => {
      setActiveUsers(users);
    });

    // Listen for messages
    socket.on('receive_message', (message) => {
      const conversationKey = `${message.fromUserId}-${currentUser?.userId}`;
      setMessages(prev => ({
        ...prev,
        [conversationKey]: [...(prev[conversationKey] || []), message]
      }));
      
      // Add notification
      setNotifications(prev => ({
        ...prev,
        [message.fromUserId]: (prev[message.fromUserId] || 0) + 1
      }));

      playNotificationSound();
    });

    // Listen for user status changes
    socket.on('user_status_changed', (statusData) => {
      console.log(`User ${statusData.username} is now ${statusData.status}`);
    });

    return () => {
      socket.off('active_users_update');
      socket.off('receive_message');
      socket.off('user_status_changed');
    };
  }, [currentUser]);

  const handleLogin = (userId, username, avatar) => {
    setCurrentUser({ userId, username, avatar });
    setIsLoggedIn(true);
    socket.emit('user_join', { userId, username, avatar });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setSelectedUser(null);
    setMessages({});
    setNotifications({});
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme === 'dark' ? 'dark-mode' : '';
  };

  const playNotificationSound = () => {
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

  const clearNotification = (userId) => {
    setNotifications(prev => ({
      ...prev,
      [userId]: 0
    }));
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="App">
      <Navbar user={currentUser} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      <div className="app-container">
        <div className="sidebar">
          <UserList
            users={activeUsers}
            currentUser={currentUser}
            selectedUser={selectedUser}
            onSelectUser={(user) => {
              setSelectedUser(user);
              clearNotification(user.userId);
            }}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            notifications={notifications}
          />
        </div>
        <div className="main-content">
          {selectedUser ? (
            <ChatWindow
              currentUser={currentUser}
              selectedUser={selectedUser}
              socket={socket}
              messages={messages}
              setMessages={setMessages}
            />
          ) : (
            <div className="welcome-screen">
              <div className="welcome-icon">💬</div>
              <h2>Your Messages</h2>
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;