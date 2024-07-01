const AppError = require("../utils/AppError");

//Send Error at development phase
const sendErrorDev = (err, res) => {
  console.error(err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};

//Send Error at production phase
const sendErrorProd = (err, res) => {
  //handleing user defined error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //handleing programming error
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went very Wrong!",
    });
  }
};

//Handle ValidationError
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(",")}`;

  return new AppError(400, message);
};

//Handle Duplicate Error
const handleDuplicateFieldErrorDB = (err) => {
  // const value = err.errmsg.match(/"([^"]*)"/)[0];

  const values = Object.values(err.keyValue);
  const message = `Duplicate fields value: ${values}. Please use another value!`;

  return new AppError(400, message);
};

//Handle Cast Error
const handleCastErrorDB = (err) => {
  return new AppError(400, `Invalid ${err.path}: ${err.value}`);
};

const handleJWTError = (err) => {
  return new AppError(401, "Invalid token. Please login in again");
};

const handleTokenExpires = (err) => {
  return new AppError(401, "Token Expires. Please login in again");
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error = Object.setPrototypeOf(error, err);

    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldErrorDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError(err);
    if (err.name === "TokenExpiresError") error = handleTokenExpires(err);
    sendErrorProd(error, res);
  }
};
