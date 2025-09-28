const Robot = require("../models/Robot");

class RobotRepository {
  async find(filter, skip, limit) {
    return Robot.find(filter).skip(skip).limit(limit);
  }

  async count(filter) {
    return Robot.countDocuments(filter);
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    return Robot.findByIdAndUpdate(id, update, options);
  }
}

module.exports = new RobotRepository();
