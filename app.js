const express = require("express");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRouter");
const contentRouter = require("./routes/contentRouter");

const app = express();

app.use(express.json());

//User route
app.use("/api/v1/users", userRouter);

//Content Route
app.use("/api/v1/contents", contentRouter);

//Handeling undefined Route
app.all("*", (req, res, next) => {
  next(new AppError(404, `Requested URL ${req.originalUrl} Not Found!`));
});

//Error Middleware
app.use(globalErrorHandler);

module.exports = app;
