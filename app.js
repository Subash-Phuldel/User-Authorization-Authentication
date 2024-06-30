const express = require("express");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./utils/errorController");

const app = express();

app.all("*", (req, res, next) => {
  next(new AppError(404, `Requested URL ${req.originalUrl} Not Found!`));
});

app.use(globalErrorHandler);
module.exports = app;
