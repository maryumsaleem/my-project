const express = require("express");
require("dotenv").config({ path: "./var/.env" });
require("./dbConnection");
const app = express();
//const AppError = require("./utils/appError");
//const globalErrorHandler = require("./controllers/errorController");
const routes = require("./routes/index");
const rateLimit = require("express-rate-limit"); //here rateLimit is a function
const helmet = require("helmet");
const bodyParser = require('body-parser');
const hpp=require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");


/************** Middlewares ****************/
app.use(helmet());
//Body parser, reading data from body into req.body and setting the limit of data to 10kb.
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use((req, res, next) => {
  console.log("HTTP Method: " + req.method + ",URL: " + req.url);
  next();
});

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS (cross site scripting)
app.use(xss());

//prevent parameter pollution
app.use(hpp());


//limit requests from same api
//rateLimit is a fuction which recieves an object as an option,
// in here we will basically define how many requests per IP we are going to allow in a certain ammount of time

const limiter = rateLimit({
  max: 100, //100 requests per hour
  windowsMs: 60 * 60 * 1000, //windows miliseconds, here 60 minutes, 60 seconds and 1000 for miliseconds.
  message: "Too many requests, please try again in an hour!",
});

app.use("/", limiter);

/************** Routes ****************/
app.use("/", routes); /*** Application Route ***/
app.all("*", (req, res, next) => {
  res.send({ message: "Invalid Route" });
});

/*** Listen to Port ***/
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
