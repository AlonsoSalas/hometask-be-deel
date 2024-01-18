module.exports = function errorMiddleware(err, req, res, next) {
  const error = {
    status: 500,
    name: "Error",
    message: "Server Error",
  };

  if (err) {
    if (err.status) error.status = err.status;
    if (err.name) error.name = err.name;
    if (err.message) error.message = err.message;
  }

  console.log({ error });
  res.status(error.status).json(error);
};
