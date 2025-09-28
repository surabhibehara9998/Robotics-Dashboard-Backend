const robotRepository = require("../repository/robotRepository");

class RobotService {
  async getRobots({ page = 1, limit = 10, status }) {
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [robots, total] = await Promise.all([
      robotRepository.find(filter, skip, limit),
      robotRepository.count(filter),
    ]);

    return {
      data: robots,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }

  async updateRobotConfig(id, config) {
    return robotRepository.findByIdAndUpdate(id, { config }, { new: true });
  }
}

module.exports = new RobotService();
