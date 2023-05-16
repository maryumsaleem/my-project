const express = require('express')
const app = express();
const routes = require('./routes/index')
require('./dbConnection')
require('dotenv').config();

// Middlewares
app.use(express.json());
app.use('/', routes);

const port=process.env.PORT||7000;
app.listen(port, () =>{
    console.log("server listening on 3000")
});