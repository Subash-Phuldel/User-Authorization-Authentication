const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (id, statusCode, res) => {
  const token = signToken(id);
  res.status(statusCode).json({
    status: "success",
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  console.log(newUser);
  createSendToken(newUser._id, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = { ...req.body };

  //Check if email and password both exits
  if (!email || !password) {
    return next(new AppError(400, "Please provide both email and password"));
  }

  //check is user exits and correct password
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(401, "Incorrect email or password"));
  }

  createSendToken(user._id, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(401, "You are not logged in! Please log in to get access.")
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const user = await User.findOne({ _id: decoded.id });

  if (!user) {
    return next(new AppError(401, "User belong to this email doesn't exits"));
  }

  if (user.passwordChangedAfter(decoded.iat)) {
    return next(new AppError(401, "User changed password. Please login again"));
  }

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(401, "You are not authorized to perform this action")
      );
    }
    next();
  });
};
