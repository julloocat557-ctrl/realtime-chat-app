import React from 'react';
import './UserList.css';

function UserList({ users, currentUser, selectedUser, onSelectUser }) {
  const otherUsers = users.filter(u => u.username !== currentUser.username);

  return (
    <div className="user-list">
      <h3>Online Users ({otherUsers.length})</h3>
      <div className="users-scroll">
        {otherUsers.length === 0 ? (
          <p className="no-users">No users online</p>
        ) : (
          otherUsers.map((user) => (
            <div
              key={user.socketId}
              className={`user-item ${selectedUser?.socketId === user.socketId ? 'active' : ''}`}
              onClick={() => onSelectUser(user)}
            >
              <div className="user-avatar">{user.avatar || '👤'}</div>
              <div className="user-info">
                <h4>{user.username}</h4>
                <span className="status online">🟢 Online</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserList;
