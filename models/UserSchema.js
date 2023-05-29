const mongoose = require('mongoose');
const UserScehma = mongoose.Schema({
    name:String,
    password: String,
    email: String
});

//a model is a class with which we construct documents
const User = mongoose.model('User', UserScehma);
module.exports = User;