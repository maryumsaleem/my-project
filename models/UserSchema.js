const crypto = require("crypto");
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
  passwordChangedAt: Date,
  passwordReseteToken: String,
  passwordResetExpires: Date,
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

//for forgotPassword
UserScehma.methods.createPasswordResetToken = function () {
  //just like a password we should not store plain reset token in database so that attacker will
  //attack to our database and reset password instead of you doing it
  //crypto.randomBytes(32): This generates a buffer containing 32 random bytes.
  //The toString method is used to convert the buffer to a string.
  //The 'hex' argument specifies the encoding format, which represents each byte as a two-digit hexadecimal number.
  const resetToken = crypto.randomBytes(32).toString("hex");

  //encrypt string
  /*
crypto.createHash('sha256'): This creates a hash object using the SHA-256 algorithm. Hash functions take an input and produce a fixed-size string of characters, which is commonly referred to as a hash value or digest. The SHA-256 algorithm is a widely-used cryptographic hash function.

.update(resetToken): The update method is used to provide the input data for the hash function. In this case, resetToken is the input string.

.digest('hex'): The digest method generates the hash value from the input data and returns it as a string. The 'hex' argument specifies that the output should be in hexadecimal format, resulting in a string representation of the hash value.
  */
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    console.log({resetToken},this.passwordResetToken);
    //giving expiry time to token in 10 minutes and converting it to miliseconds
    this.passwordResetExpires=Date.now()+10*60*1000;
    return resetToken;
};
//a model is a class with which we construct documents
const User = mongoose.model("User", UserScehma);
module.exports = User;
