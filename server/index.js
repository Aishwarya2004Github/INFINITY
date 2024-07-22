const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const dotenv = require("dotenv");
const http = require("http");
const socketIO = require("socket.io");
const multer = require('multer');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define your upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files

// Handle file upload
app.post('/send-audio', upload.single('audio'), (req, res) => {
  try {
    res.json({ filePath: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(400).send('Error uploading file.');
  }
});
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

let onlineUsers = new Map(); // Use a Map to store userId and their corresponding socketId

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId; // Get userId from query or another method

  if (userId) {
    // Add user to online users
    onlineUsers.set(userId, socket.id);
    io.emit('get-users', Array.from(onlineUsers.keys())); // Broadcast online users to all clients

    // Handle disconnection
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('get-users', Array.from(onlineUsers.keys())); // Broadcast updated online users list
    });

    // Handle adding a user
    socket.on('add-user', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('get-users', Array.from(onlineUsers.keys())); // Broadcast updated online users list
    });
  }
});
let users = {}; // Store user statuses
global.onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('update-status', (status) => {
    const { userId, online } = status;
    users[userId] = { online, socketId: socket.id }; // Include socketId for disconnections

    // Broadcast the status update to other connected clients
    socket.broadcast.emit('user-online-status', { userId, online });
  });

  socket.on('add-user', (userId) => {
    if (userId) {
      console.log('Adding user:', userId);
      global.onlineUsers.set(userId, socket.id);
      console.log('Current online users:', Array.from(global.onlineUsers.entries()));
    } else {
      console.log('Invalid userId:', userId);
    }
  });

  socket.on('send-msg', (data) => {
    console.log(`Sending message from ${data.from} to ${data.to}`);
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', data.msg);
    }
  });

  socket.on('video-offer', (offer) => {
    socket.broadcast.emit('video-offer', offer);
  });

  socket.on('video-answer', (answer) => {
    socket.broadcast.emit('video-answer', answer);
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('start-voice-call', () => {
    console.log('Voice call started');
    // Handle voice call logic here
  });

  socket.on('end-voice-call', () => {
    console.log('Voice call ended');
    // Handle end of voice call here
  });

  socket.on('start-video-call', () => {
    console.log('Video call started');
    // Handle video call logic here
  });

  socket.on('end-video-call', () => {
    console.log('Video call ended');
    // Handle end of video call here
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from onlineUsers on disconnect
    global.onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        global.onlineUsers.delete(userId);
      }
    });
    console.log('Current online users:', Array.from(global.onlineUsers.entries()));
    // Broadcast offline status to other clients
    socket.broadcast.emit('user-online-status', { userId: socket.id, online: false });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
