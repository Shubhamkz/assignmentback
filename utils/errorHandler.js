const errorHandler = (err, req, res, next) => {
  console.log("Error:", err.message || err);
  res
    .status(err.status || 500)
    .json({ message: "Internal Server Error", success: false, error: err });
};

module.exports = errorHandler;
