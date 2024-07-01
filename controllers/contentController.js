const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getContent = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Content for login user",
  });
});

exports.getContentForAdmin = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Content for login user",
  });
});
