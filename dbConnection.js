const mongoose = require('mongoose');
require("dotenv").config({path: "./var/.env"});
//const db = 'mongodb+srv://saad:saad8212@cluster0.irhxo3y.mongodb.net/chatbot'
const db = process.env.DB_URL;
mongoose.connect(db).then(() =>{
    console.log('Database Connection Established')
}).catch((err) => {
    console.log("Error Connecting Database", err)
}) 