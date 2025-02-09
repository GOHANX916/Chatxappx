const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/auth");

require("dotenv").config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins, change this in production
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI; // Store MongoDB URI in .env file

// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// WebSocket connection
io.on("connection", (socket) => {
    console.log("🔵 A user connected:", socket.id);

    socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data); // Broadcast message to all users
    });

    socket.on("disconnect", () => {
        console.log("🔴 A user disconnected:", socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
