require("dotenv").config();
const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const login_token = "admin_token";
const bcrypt = require("bcryptjs");
const util = require("util");
const reset_key = "reset_token";
const { transporter } = require("../utils/nodeMailer");
const cookieOptions = {
  httpOnly: true,  //This option sets the "HttpOnly" flag for the cookie, which ensures that the cookie is only accessible through HTTP(S) requests and cannot be accessed or modified by client-side JavaScript. This is a security measure to protect the cookie from cross-site scripting (XSS) attacks.
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), //calculates the expiration time to be 90 days in milliseconds from the current time.
};
/*** Sign Up new user ***/
const signup = async (req, res, next) => {
  try {
    let newUser = await new User(req.body);
    newUser = await newUser.save();
    let token = jwt.sign({ id: newUser._id }, login_token);
    /*
    The res.cookie function is provided by the Express framework,
     and it allows you to set a cookie in the response. It takes three parameters:
     name: The name of the cookie.
     value: The value of the cookie.
     options (optional): Additional options to configure the cookie.

    In the code snippet, res.cookie('jwt_review', token, cookieOptions) sets a cookie
    named 'jwt_review' with the value of the token variable.
    The cookieOptions object is provided
    as the third parameter and contains additional configuration options for the cookie.
    */
    res.cookie("jwt_review", token, cookieOptions);
    res.status(200).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

/*** Login existing user ***/
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "failed!",
        message: "Please enter Email and Password",
      });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        status: "failed!",
        message: "No user with this email found!",
      });
    }
    console.log(process.env.LOGIN_TOKIN);
    let comp = await bcrypt.compare(req.body.password, user.password);
    if (!comp) {
      return res
        .status(401)
        .send({ message: "Email or Password is Not Valid" });
    }
    let token = jwt.sign({ id: user._id }, login_token);
    console.log(token);
    res.cookie("jwt_review", token, cookieOptions);
    await transporter.sendMail({
      from: "saadshabbir@leilanitech.com",
      to: email,
      subject: "Login",
      text: "You are successfully logged in!",
    });
    res.status(200).json({
      status: "success",
      token,
      email: user.email,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
const protect = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      let decoded = await util.promisify(jwt.verify)(token, login_token);
      let freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        res.status(401).json({
          status: "Your Login Token has been Expired, Please Login again",
          message: err.message,
        });
      }
      req.user = freshUser;
      next();
      // Check whether user has changed password after token issued
    } else {
      res.status(403).json({
        status: "failed",
        message: "You are not Logged In, Please Login First...",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failed!",
      message: err.message,
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // const { roles} = req.user; // Assuming the user object is stored in req.user
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ status: "failed", message: "You are not Authorized" });
    }
    next();
  };
};

/*** Reset Password***/
async function resetPassword(req, res) {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json({ message: "User not found with this email" });
    return;
  }

  jwt.sign({ user }, reset_key, { expiresIn: "5h" }, (err, token) => {
    if (err) {
      res.status(500).json({ message: "Error generating token" });
      return;
    }

    const resetLink = `${process.env.RESET}?token=${token}`;
    transporter
      .sendMail({
        from: "maryumsaleem51@gmail.com",
        to: req.body.email,
        subject: "Reset Password",
        text: `Reset your password using the following link: ${resetLink}`,
      })
      .then((response) => {
        console.log(token, user, response);
        res
          .cookie("reset-token", token, { maxAge: 600000 })
          .send({ message: "Reset link sent to your email!" });
      })
      .catch((error) => {
        res.status(500).json({ message: "Error sending email" });
      });
  });
}

/*** New Password ***/
async function newPassword(req, res) {
  if (!req.body.password) {
    res.send({ message: "Password is Required!" });
    return true;
  }
  try {
    let email = req.body.email;
    let encrypted = await bcrypt.hash(req.body.password, 12);
    console.log(encrypted);
    let update = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: encrypted } },
      { new: true }
    );
     res.clearCookie("reset-token")
    res.json({ message: "Password Updated Successfully! " + update });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

/*** Export Functions ***/
module.exports = {
  login,
  signup,
  protect,
  restrictTo,
  resetPassword,
  newPassword,
};
