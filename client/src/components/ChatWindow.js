import React, { useState, useRef, useEffect } from 'react';
import './ChatWindow.css';

function ChatWindow({ currentUser, selectedUser, socket, messages }) {
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Filter messages for this conversation
    const filteredMessages = messages.filter(
      m => (m.fromUserId === currentUser.userId && m.toUserId === selectedUser.username) ||
            (m.fromUserId === selectedUser.username && m.toUserId === currentUser.userId)
    );
    setChatMessages(filteredMessages);
    scrollToBottom();
  }, [messages, selectedUser, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      const messageData = {
        fromUserId: currentUser.userId,
        toUserId: selectedUser.username,
        message: messageText,
        messageId: `msg_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString()
      };
      socket.emit('send_message', messageData);
      setChatMessages(prev => [...prev, { ...messageData, fromUserId: currentUser.userId }]);
      setMessageText('');
      setIsTyping(false);
      socket.emit('stop_typing', { fromUserId: currentUser.userId, toUserId: selectedUser.username });
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { fromUserId: currentUser.userId, toUserId: selectedUser.username });
    setIsTyping(true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { fromUserId: currentUser.userId, toUserId: selectedUser.username });
      setIsTyping(false);
    }, 3000);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <span className="chat-avatar">{selectedUser.avatar || '👤'}</span>
          <div>
            <h2>{selectedUser.username}</h2>
            <span className="status-indicator">🟢 Online</span>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {chatMessages.length === 0 ? (
          <div className="no-messages">
            <p>👋 Start a conversation with {selectedUser.username}!</p>
          </div>
        ) : (
          chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.fromUserId === currentUser.userId ? 'sent' : 'received'}`}
            >
              <div className="message-content">{msg.message}</div>
              <span className="message-time">{msg.timestamp}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
            handleTyping();
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatWindow;
