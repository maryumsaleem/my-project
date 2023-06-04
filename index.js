const express = require("express");
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler=require("./controllers/errorController");
const routes = require("./routes/index");

require("./dbConnection");
require("dotenv").config({ path: "./var/.env" });

// Middlewares
app.use(express.json());
app.use((req, res, next) => {
  console.log("HTTP Method: " + req.method + ",URL: " + req.url);
  next();
});
app.use("/", routes);
app.all("*", (req, res, next) => {
  //   res.status(404).json({
  //     status: "fail",
  //     message: `Cant find ${req.originalUrl} on this server.`,
  //   });
  //creating new err object while calling the constructor
//   const err = new Error(`can't find ${req.originalUrl} on this server.`);
//   err.status = "fail";
//   err.statusCode = 404;

//created instance of AppError class and added 2 arguments as mentioned in ctor 
  next(new AppError(`can't find ${req.originalUrl} on this server.`,404));
});

//Global error handling middleware
//with four arguments express would know that it is a error handling middleware
app.use(globalErrorHandler);

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
