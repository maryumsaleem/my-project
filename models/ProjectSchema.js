const mongoose = require('mongoose');
const ProjectScehma = mongoose.Schema({
    name: String,
    email: String,
    phone: {
        type: String,
        select: false
    },
    address: String
});

//a model is a class with which we construct documents
const Project = mongoose.model('Project', ProjectScehma);
module.exports = Project;