// routes/auth.js
const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controller/authController");
const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  register
);
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  login
);

module.exports = router;
