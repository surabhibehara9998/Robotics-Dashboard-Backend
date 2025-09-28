require("dotenv").config();
const mongoose = require("mongoose");

const user = process.env.MONGO_USER;
const pass = encodeURIComponent(process.env.MONGO_PASS);
const host = process.env.MONGO_HOST;
const db = process.env.MONGO_DB || "robotics";

const uri = `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected to", conn.connection.name);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
