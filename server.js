const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active users
const activeUsers = new Map();
const userChats = new Map();
const userNotifications = new Map();

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins
  socket.on('user_join', (userData) => {
    const { userId, username, avatar } = userData;
    activeUsers.set(userId, {
      socketId: socket.id,
      username,
      avatar,
      status: 'online',
      lastSeen: new Date()
    });

    socket.userId = userId;
    io.emit('user_status_changed', { userId, status: 'online', username });
    io.emit('active_users_update', Array.from(activeUsers.values()));
  });

  // Send message
  socket.on('send_message', (messageData) => {
    const { fromUserId, toUserId, message, messageId, timestamp } = messageData;
    const toUser = activeUsers.get(toUserId);

    // Store message
    if (!userChats.has(messageId)) {
      userChats.set(messageId, []);
    }
    userChats.get(messageId).push(messageData);

    // Send message to recipient
    if (toUser) {
      io.to(toUser.socketId).emit('receive_message', {
        fromUserId,
        message,
        timestamp,
        messageId
      });
    }

    // Create notification
    if (!userNotifications.has(toUserId)) {
      userNotifications.set(toUserId, []);
    }
    userNotifications.get(toUserId).push({
      type: 'new_message',
      fromUserId,
      message,
      read: false,
      timestamp
    });

    // Send notification
    if (toUser) {
      io.to(toUser.socketId).emit('notification', {
        type: 'new_message',
        fromUserId,
        fromUsername: activeUsers.get(fromUserId)?.username,
        message
      });
    }

    console.log(`Message from ${fromUserId} to ${toUserId}`);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { fromUserId, toUserId } = data;
    const toUser = activeUsers.get(toUserId);
    if (toUser) {
      io.to(toUser.socketId).emit('user_typing', { fromUserId });
    }
  });

  socket.on('stop_typing', (data) => {
    const { fromUserId, toUserId } = data;
    const toUser = activeUsers.get(toUserId);
    if (toUser) {
      io.to(toUser.socketId).emit('user_stop_typing', { fromUserId });
    }
  });

  // Create/Join group chat
  socket.on('create_group', (groupData) => {
    const { groupId, groupName, members } = groupData;
    members.forEach(memberId => {
      const member = activeUsers.get(memberId);
      if (member) {
        io.to(member.socketId).emit('group_created', { groupId, groupName });
      }
    });
  });

  // Send group message
  socket.on('send_group_message', (groupMessageData) => {
    const { groupId, fromUserId, message, timestamp } = groupMessageData;
    io.emit('receive_group_message', {
      groupId,
      fromUserId,
      fromUsername: activeUsers.get(fromUserId)?.username,
      message,
      timestamp
    });
  });

  // Message reaction
  socket.on('message_reaction', (reactionData) => {
    const { messageId, reaction, userId } = reactionData;
    io.emit('reaction_added', { messageId, reaction, userId });
  });

  // User disconnection
  socket.on('disconnect', () => {
    const user = Array.from(activeUsers.entries()).find(([, v]) => v.socketId === socket.id);
    if (user) {
      const [userId, userData] = user;
      activeUsers.delete(userId);
      io.emit('user_status_changed', { userId, status: 'offline', username: userData.username });
      io.emit('active_users_update', Array.from(activeUsers.values()));
      console.log('User disconnected:', userId);
    }
  });
});

// REST API Routes
app.get('/api/active-users', (req, res) => {
  res.json(Array.from(activeUsers.values()));
});

app.get('/api/notifications/:userId', (req, res) => {
  const notifications = userNotifications.get(req.params.userId) || [];
  res.json(notifications);
});

app.post('/api/clear-notifications/:userId', (req, res) => {
  userNotifications.delete(req.params.userId);
  res.json({ message: 'Notifications cleared' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
