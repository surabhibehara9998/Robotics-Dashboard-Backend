const { validationResult } = require("express-validator");
const authService = require("../services/authService");

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    res.status(201).json(result);
  } catch (err) {
    if (err.message === "Email already in use") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    if (err.message === "Invalid credentials") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};
