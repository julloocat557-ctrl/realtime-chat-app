import React, { useMemo } from 'react';
import './UserList.css';

function UserList({ users, currentUser, selectedUser, onSelectUser, searchTerm, setSearchTerm, notifications }) {
  const otherUsers = useMemo(() => {
    return users.filter(u => u.username !== currentUser.username);
  }, [users, currentUser]);

  const filteredUsers = useMemo(() => {
    return otherUsers.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [otherUsers, searchTerm]);

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Messages</h2>
      </div>

      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-scroll">
        {filteredUsers.length === 0 ? (
          <div className="no-users">
            {otherUsers.length === 0 ? (
              <>
                <p className="empty-icon">👥</p>
                <p>No users online</p>
              </>
            ) : (
              <>
                <p className="empty-icon">🔍</p>
                <p>No results found</p>
              </>
            )}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.socketId}
              className={`user-item ${selectedUser?.socketId === user.socketId ? 'active' : ''}`}
              onClick={() => onSelectUser(user)}
            >
              <div className="user-item-content">
                <div className="user-item-avatar">{user.avatar}</div>
                <div className="user-item-info">
                  <h4>{user.username}</h4>
                  <span className="user-status">🟢 Active now</span>
                </div>
              </div>
              {notifications[user.userId] > 0 && (
                <div className="notification-badge">{notifications[user.userId]}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserList;
