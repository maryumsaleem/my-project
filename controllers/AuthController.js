require('dotenv').config();
const User = require('../models/UserSchema');
const jwt = require("jsonwebtoken");
const jwt_key = "admin_token";
const bcrypt = require("bcryptjs");

/*** Sign Up new user ***/
const signup = async (req, res, next) => {
  //existing user check
  //hashed password
  //user creation
  //token generate
  const { name, email, password } = req.body;
  try {
    //existing user check
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.send(400).json({
        message: 'User already exists'
      })
    }
    //hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    //new user creation
    const result = await User.create({
      email: email,
      password: hashedPassword,
      name: name
    });
 //token generate
 const token = jwt.sign({email:result.email,id:result._id}, jwt_key);
 res.status(201).json({user:result,token:token});

  }
  catch (err) {
console.log(err);
res.status(500).json({
  message:"something went wrong"
});
  }
}

/*** Login existing user ***/
async function checkLogin(req, res) {
  const { email, password } = req.body;
  if (!password || !email) {
    res.send({ message: "Email and Passwod is required" });
    return true;
  }
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(403).send({ message: "No user Found With this Email!!!" });
  }
  let comp = await bcrypt.compare(password, user.password);
  if (comp) {
    jwt.sign({ user }, jwt_key, (err, token) => {
      if (err) {
        return res.send({ message: "No User Found With this Password!!!" });
      }
      res.send({ _id: user._id, email: user.email, token: token });
    });
  } else {
    return res.status(403).send({ message: "Password is Not Valid" });
  }
}
/*** Export Functions ***/
module.exports = { checkLogin, signup };