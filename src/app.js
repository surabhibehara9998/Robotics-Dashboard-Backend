const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const robotRoutes = require("./routes/robot");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.disable("x-powered-by");

// CORS (configure in production to specific origins)
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// Logging
app.use(morgan("dev"));

// JSON parsing
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/robots", robotRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
