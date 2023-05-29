const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UserScehma = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell your name"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: function (el) {
            //here this refers to current schema
            return el === this.password;
        }
    },
    email: {
        type: String,
        required: [true, "Please provide your email address"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "please provide an valid email"]
    }
});

UserScehma.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})
//a model is a class with which we construct documents
const User = mongoose.model('User', UserScehma);
module.exports = User;