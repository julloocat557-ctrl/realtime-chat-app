import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';

function ChatWindow({ currentUser, selectedUser, socket, messages, setMessages }) {
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const conversationKey = `${currentUser.userId}-${selectedUser.userId}`;
  const reverseConversationKey = `${selectedUser.userId}-${currentUser.userId}`;

  useEffect(() => {
    const allMessages = [
      ...(messages[conversationKey] || []),
      ...(messages[reverseConversationKey] || [])
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    setChatMessages(allMessages);
    scrollToBottom();
  }, [messages, conversationKey, reverseConversationKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      const messageData = {
        fromUserId: currentUser.userId,
        toUserId: selectedUser.userId,
        message: messageText,
        messageId: `msg_${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      socket.emit('send_message', messageData);

      setMessages(prev => ({
        ...prev,
        [conversationKey]: [...(prev[conversationKey] || []), messageData]
      }));

      setMessageText('');
      setIsTyping(false);
      socket.emit('stop_typing', { fromUserId: currentUser.userId, toUserId: selectedUser.userId });
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { fromUserId: currentUser.userId, toUserId: selectedUser.userId });
    setIsTyping(true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { fromUserId: currentUser.userId, toUserId: selectedUser.userId });
      setIsTyping(false);
    }, 3000);
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <span className="chat-avatar">{selectedUser.avatar}</span>
          <div>
            <h2>{selectedUser.username}</h2>
            <span className="chat-status">Active now</span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="header-btn" title="Call">☎️</button>
          <button className="header-btn" title="Video call">📹</button>
          <button className="header-btn" title="Info">ℹ️</button>
        </div>
      </div>

      <div className="messages-container">
        {chatMessages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">{selectedUser.avatar}</div>
            <h3>No messages yet</h3>
            <p>Start a conversation with {selectedUser.username}!</p>
          </div>
        ) : (
          chatMessages.map((msg, index) => {
            const isSent = msg.fromUserId === currentUser.userId;
            return (
              <div key={index} className={`message ${isSent ? 'sent' : 'received'}`}>
                {!isSent && <span className="message-avatar">{selectedUser.avatar}</span>}
                <div className="message-bubble-wrapper">
                  <div className="message-bubble">{msg.message}</div>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Aa"
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
            handleTyping();
          }}
          className="message-text-input"
        />
        {messageText.trim() ? (
          <button type="submit" className="send-btn">📤</button>
        ) : (
          <button type="button" className="action-btn">😊</button>
        )}
      </form>
    </div>
  );
}

export default ChatWindow;
