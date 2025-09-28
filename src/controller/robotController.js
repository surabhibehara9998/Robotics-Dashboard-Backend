const { validationResult } = require("express-validator");
const robotService = require("../services/robotService");

exports.getRobots = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const result = await robotService.getRobots({ page, limit, status });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.updateRobotConfig = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { config } = req.body;

    const updatedRobot = await robotService.updateRobotConfig(id, config);

    if (!updatedRobot) {
      return res.status(404).json({ message: "Robot not found" });
    }

    res.json(updatedRobot);
  } catch (err) {
    next(err);
  }
};
