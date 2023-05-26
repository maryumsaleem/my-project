require('dotenv').config();
const User = require('../models/UserSchema');
const jwt=require("jsonwebtoken");
const jwt_key="admin_token";
const bcrypt = require("bcryptjs"); 

/*** Login existing user ***/ 
async function checkLogin(req, res) {
    const {email,password}=req.body;
    if(!password||!email){
        res.send({message:"Email and Passwod is required"});
        return true;
    }
    let user= await User.findOne({email});
    if(!user){
        return res.status(403).send({ message: "No user Found With this Email!!!" });
    }
    let comp=await bcrypt.compare(password, user.password);
    if(comp){
        jwt.sign({ user }, jwt_key, (err, token) => {
            if (err) {
              return res.send({ message: "No User Found With this Email!!!" });
            }
            res.send({ _id: user._id, email: user.email, token: token });
          });
        } else {
          return res.status(403).send({ message: "Password is Not Valid" });
        }
    }
/*** Export Functions ***/
module.exports = { checkLogin };