const AppError = require("./AppError");

//Send Error at development phase
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    stack: err.stack,
    message: err.message,
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

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};
