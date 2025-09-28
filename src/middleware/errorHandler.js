const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
};

module.exports = { errorHandler };
