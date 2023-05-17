const mongoose = require('mongoose');
const ProjectScehma = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String
});

const Project = mongoose.model('Project', ProjectScehma);
module.exports = Project;