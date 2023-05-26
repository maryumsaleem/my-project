const mongoose = require('mongoose');
require("dotenv").config({path: "./var/.env"});
const db = process.env.DB_URL;
mongoose.connect(db).then(() =>{
    console.log('Database Connection Established')
}).catch((err) => {
    console.log("Error Connecting Database", err);
    
}) 