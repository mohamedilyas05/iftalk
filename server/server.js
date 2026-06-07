const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const User = require("./models/User");
dotenv.config();
connectDB();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("IFtalk API Running");
});

// 🔥 CREATE HTTP SERVER (IMPORTANT)
const server = http.createServer(app);

// 🔥 SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// store online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 🟢 JOIN
  socket.on("join", (userId) => {
    if (!userId) return;

    // remove old socket if user reconnects
    for (let [uid, sid] of onlineUsers.entries()) {
      if (uid === userId && sid !== socket.id) {
        onlineUsers.delete(uid);
      }
    }

    onlineUsers.set(userId, socket.id);

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
  


// ✅ TYPING
socket.on("typing", ({ receiverId, username }) => {
  const receiverSocket = onlineUsers.get(receiverId);

  if (receiverSocket) {
    io.to(receiverSocket).emit("userTyping", {
      username,
    });
  }
});


// ✅ STOP TYPING
socket.on("stopTyping", ({ receiverId }) => {
  const receiverSocket = onlineUsers.get(receiverId);

  if (receiverSocket) {
    io.to(receiverSocket).emit("userStopTyping");
  }
});


// ✅ SEND MESSAGE
socket.on("sendMessage", (data) => {
  const { receiverId, message } = data;

  if (!receiverId || !message) return;

  const receiverSocket = onlineUsers.get(receiverId);

  if (receiverSocket) {
    io.to(receiverSocket).emit("receiveMessage", message);
  }
});

 
  // 🔴 DISCONNECT
  socket.on("disconnect", async (reason) => {
  console.log("User disconnected:", socket.id, reason);

  let disconnectedUserId = null;

  for (let [userId, socketId] of onlineUsers.entries()) {
    if (socketId === socket.id) {
      disconnectedUserId = userId;
      onlineUsers.delete(userId);
      break;
    }
  }

  if (disconnectedUserId) {
    try {
      await User.findByIdAndUpdate(disconnectedUserId, {
        lastSeen: new Date(),
      });
    } catch (err) {
      console.log(err);
    }
  }

  io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
});
  
});

const PORT = process.env.PORT || 5000;

// 🔥 IMPORTANT: use server.listen (NOT app.listen)
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});