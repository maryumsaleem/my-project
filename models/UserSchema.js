const mongoose = require('mongoose');
const UserScehma = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell your name"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email address"]
    }
});

//a model is a class with which we construct documents
const User = mongoose.model('User', UserScehma);
module.exports = User;