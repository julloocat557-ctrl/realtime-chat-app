import React, { useState, useEffect } from 'react';
import './Notifications.css';

function Notifications({ notifications }) {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setVisibleNotifications([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  return (
    <div className="notifications-container">
      {visibleNotifications.map((notif, index) => (
        <div key={index} className="notification-item">
          <span className="notification-avatar">{notif.fromUsername?.[0] || '👤'}</span>
          <div className="notification-content">
            <strong>{notif.fromUsername}</strong>
            <p>{notif.message}</p>
          </div>
          <button
            className="notification-close"
            onClick={() => setVisibleNotifications(prev => prev.filter((_, i) => i !== index))}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
