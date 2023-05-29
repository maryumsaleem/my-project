//JWT Authentication Middleware
const jwt = require("jsonwebtoken");
const jwt_key = "admin_token";
let verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, jwt_key)
      req.userId = user.id;
    }
    else {
      res.status(401).json({
        message: "unauthorized user"
      });
    }
    next();
  }
  //accessing token
  catch (err) {
    console.error(err);
    res.status(401).json({
      message: "Unauthorized user"
    })
  }
};

module.exports = { verifyToken };