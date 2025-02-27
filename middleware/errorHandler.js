function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  console.log({ errorName: err.name });
  console.log({ errorMessage: err.message });
  switch (err.name) {
    case "BadRequest":
      statusCode = 400;
      errorMessage = err.message || "Bad Request";
      break;
    case "unauthorized":
      statusCode = 401;
      errorMessage = err.message || "Unauthorized";
      break;
    case "NotFound":
      statusCode = 404;
      errorMessage = err.message || "Not Found";
      break;
    case "Forbidden":
      statusCode = 403;
      errorMessage = err.message || "You're not authorized";
      break;
    case "BSONError":
      statusCode = 404;
      errorMessage = "Packet Not Found";
      break;
    case "JsonWebTokenError":
      statusCode = 401;
      errorMessage = err.message || "Invalid Token";
      break;
    default:
      statusCode = 500;
      errorMessage = "Internal Server Error";
  }
  res.status(statusCode).json({ message: errorMessage });
}

module.exports = errorHandler;
