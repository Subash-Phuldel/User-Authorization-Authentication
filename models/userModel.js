const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: [true, "User name must be unique"],
    require: [true, "User name must be required"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: [true, "Email name must be unique"],
    require: [true, "Email name must be required"],
    validate: [validator.isEmail, "Please provide valid email"],
  },
  password: {
    type: String,
    minlength: [8, "Password must be 8 characters long"],
    unique: [true, "Password name must be unique"],
    require: [true, "Password name must be required"],
  },
  passwordConfirm: {
    type: String,
    min: [8, "Password Confirm must be 8 characters long"],
    unique: [true, "Password confirm name must be unique"],
    require: [true, "Password Confirm name must be required"],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: `Password and PasswordConfirm doesn't match`,
    },
  },
  roles: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "User role must be user or admin",
    },
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
