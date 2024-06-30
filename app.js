const express = require("express");
const app = express();

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Request URL ${req.originalUrl} NOT FOUND!`,
  });
});

module.exports = app;
