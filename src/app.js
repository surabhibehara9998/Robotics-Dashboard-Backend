const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const robotRoutes = require("./routes/robot");
const { errorHandler } = require("./middleware/errorHandler");
const mongoose = require("mongoose");

const app = express();

app.use(helmet());
app.disable("x-powered-by");

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

app.use(morgan("dev"));

app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", loginLimiter);

app.get("/healthz", (req, res) => {
  const state = mongoose.connection.readyState;
  if (state === 1) return res.status(200).json({ status: "ok" });
  return res.status(503).json({ status: "unhealthy", mongoose_state: state });
});

app.use("/api/auth", authRoutes);
app.use("/api/robots", robotRoutes);

app.use(errorHandler);

module.exports = app;
