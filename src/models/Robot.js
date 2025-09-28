const mongoose = require("mongoose");

const robotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "error"],
      default: "inactive",
    },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Robot", robotSchema);
