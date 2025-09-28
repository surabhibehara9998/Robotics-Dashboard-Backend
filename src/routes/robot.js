// routes/robots.js
const express = require("express");
const { query, param } = require("express-validator");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getRobots,
  updateRobotConfig,
} = require("../controller/robotController");

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1 }),
    query("status").optional().isIn(["active", "inactive", "error"]),
  ],
  getRobots
);

router.put("/:id/config", auth, [param("id").isMongoId()], updateRobotConfig);

module.exports = router;
