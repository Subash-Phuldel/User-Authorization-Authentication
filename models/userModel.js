const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: [true, "User name must be unique"],
    required: [true, "User name must be required"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: [true, "Email name must be unique"],
    required: [true, "Email name must be required"],
    validate: [validator.isEmail, "Please provide valid email"],
  },
  password: {
    type: String,
    minlength: [8, "Password must be 8 characters long"],
    required: [true, "Password name must be required"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    minlength: [8, "Password Confirm must be 8 characters long"],
    required: [true, "Password Confirm name must be required"],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: `Password and PasswordConfirm doesn't match`,
    },
    select: false,
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

//Encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.isNew) next();

  this.password = await bcrypt.hash(this.password, 13);
  this.passwordConfirm = undefined;
  next();
});

//check correct Password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
