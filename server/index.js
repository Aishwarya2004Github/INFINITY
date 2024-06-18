const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors({ origin: 'http://localhost:3000', credentials:true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});


global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    if (userId) { // Ensure userId is not undefined
      console.log('User connected:', userId);
      onlineUsers.set(userId, socket.id);
      console.log('Current online users:', Array.from(onlineUsers.entries()));
    } else {
      console.log('Invalid userId:', userId);
    }
  });

  socket.on('send-msg', (data) => {
    console.log(`Current online users:`, Array.from(onlineUsers.entries()));
    const sendUserSocket = onlineUsers.get(data.to);
    console.log('Send user socket:', sendUserSocket);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', data.msg); // Fixed event name
    }
  });
});
