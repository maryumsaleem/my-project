//JWT Authentication Middlew
const jwt=require("jsonwebtoken");
const jwt_key="admin_token";
let verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
     if (token) {
       token = token.split(" ")[1];
       jwt.verify(token,jwt_key,(err,response) =>{
         if(err) {
             res.status(401).send({message: err });
         } else {
             next();
         }
     })
   } else {
     res.status(403).send({ message: "Token is required" });
   }
 };

 module.exports = { verifyToken };