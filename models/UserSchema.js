const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const UserScehma = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell your name"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: function (el) {
      //here this refers to current schema
      return el === this.password;
    },
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "please provide an valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    trim: true,
    required: [true, "Please specify user role"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // image:{
  //     data:Buffer,
  //     dataType: String
  // }
});

UserScehma.pre("save", async function (next) {
  //only run this function if password was modified
  if (!this.isModified("password")) return next();
  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
//a model is a class with which we construct documents
const User = mongoose.model("User", UserScehma);
module.exports = User;
