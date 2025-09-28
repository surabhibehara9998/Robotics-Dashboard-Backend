require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const TELEMETRY_INTERVAL_MS = 500;

async function start() {
  await connectDB();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PUT"],
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];
      if (!token) return next(new Error("Authentication error: token missing"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      return next();
    } catch (err) {
      return next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (user ${socket.user?.id})`);

    const interval = setInterval(() => {
      const telemetry = {
        robotId: `robot-${Math.ceil(Math.random() * 5)}`,
        timestamp: new Date().toISOString(),
        location: {
          lat: 12.9716 + (Math.random() - 0.5) * 0.01,
          lon: 77.5946 + (Math.random() - 0.5) * 0.01,
        },
        battery: Math.max(0, Math.floor(100 * Math.random())),
        status: ["active", "inactive", "error"][Math.floor(Math.random() * 3)],
      };
      socket.emit("telemetry", telemetry);
    }, TELEMETRY_INTERVAL_MS);

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} reason: ${reason}`);
      clearInterval(interval);
    });

    socket.on("subscribe", (payload) => {
      console.log("subscribe payload:", payload);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = async () => {
    console.log("Shutting down server...");
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });

    setTimeout(() => process.exit(1), 10000);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
