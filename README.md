# Real-Time Chat Application 💬

A modern, real-time chat web application built with React, Node.js, and Socket.IO. Users can chat with each other, receive notifications, and see online/offline status.

## Features ✨

- **Real-Time Messaging**: Instant message delivery using Socket.IO
- **User Status**: See who's online with live status indicators
- **Notifications**: Get alerted when you receive new messages
- **Typing Indicator**: See when someone is typing
- **User Avatars**: Choose from different avatar options
- **Group Chat Support**: Ready for group messaging features
- **Message Reactions**: Support for emoji reactions on messages
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Modern gradient-based interface

## Tech Stack 🛠️

### Frontend
- React 18.2
- Socket.IO Client
- CSS3 with Flexbox/Grid
- React Router

### Backend
- Node.js
- Express.js
- Socket.IO
- Firebase (optional for database)

## Installation 📦

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/julloocat557-ctrl/realtime-chat-app.git
cd realtime-chat-app
```

2. Install backend dependencies
```bash
npm install
```

3. Create a `.env` file
```bash
cp .env.example .env
```

4. Update `.env` with your configuration (Firebase keys if using Firebase)

5. Start the backend server
```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory
```bash
cd client
```

2. Install frontend dependencies
```bash
npm install
```

3. Start the React development server
```bash
npm start
```

The client will open at `http://localhost:3000`

## Usage 🚀

1. **Login**: Enter your username and choose an avatar
2. **View Online Users**: See all users currently online in the sidebar
3. **Start Chatting**: Click on any user to open a chat window
4. **Send Messages**: Type your message and press Send or Enter
5. **Receive Notifications**: Get alerts when new messages arrive
6. **See Status**: Check if users are online or offline

## Project Structure 📁

```
realtime-chat-app/
├── server.js                 # Express server & Socket.IO setup
├── package.json             # Backend dependencies
├── .env.example             # Environment variables template
└── client/
    ├── public/
    │   └── index.html      # HTML template
    ├── src/
    │   ├── App.js          # Main app component
    │   ├── App.css         # Main app styles
    │   ├── index.js        # React entry point
    │   ├── index.css       # Global styles
    │   └── components/
    │       ├── ChatWindow.js       # Chat interface
    │       ├── ChatWindow.css
    │       ├── UserList.js        # Online users list
    │       ├── UserList.css
    │       ├── Notifications.js   # Notification system
    │       ├── Notifications.css
    │       ├── Navbar.js          # Top navigation
    │       └── Navbar.css
    └── package.json        # Frontend dependencies
```

## Socket.IO Events 🔌

### Client → Server
- `user_join`: User joins the chat
- `send_message`: Send a message to another user
- `typing`: User is typing
- `stop_typing`: User stopped typing
- `create_group`: Create a group chat
- `send_group_message`: Send message to group
- `message_reaction`: Add reaction to message

### Server → Client
- `active_users_update`: List of online users
- `receive_message`: New message received
- `notification`: New notification
- `user_status_changed`: User came online/offline
- `user_typing`: Someone is typing
- `user_stop_typing`: Someone stopped typing
- `receive_group_message`: Group message received
- `reaction_added`: Reaction added to message

## Customization 🎨

### Change Colors
Edit the gradient colors in `client/src/App.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add More Avatars
Update the `avatars` array in `LoginPage` component:
```javascript
const avatars = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧔', '👨‍🦰', '👩‍🦰'];
```

## Future Enhancements 🚀

- [ ] Persistent message storage in database
- [ ] User authentication & authorization
- [ ] Group chat functionality
- [ ] File/Image sharing
- [ ] Message search
- [ ] User profiles & settings
- [ ] Dark mode toggle
- [ ] Message encryption
- [ ] Video/Audio calls
- [ ] Mobile app (React Native)

## Troubleshooting 🔧

### Connection Error
- Ensure backend server is running on port 5000
- Check firewall settings
- Verify Socket.IO connection URL in App.js

### Port Already in Use
```bash
# Change port in server.js or .env
PORT=5001 npm start
```

### Frontend Build Issues
```bash
# Clear cache and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
npm start
```

## License 📄

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing 🤝

Contributions are welcome! Feel free to open issues or submit pull requests.

## Support 💬

For questions or issues, please open a GitHub issue or contact the maintainers.

---

Made with ❤️ by the Chat App Team
