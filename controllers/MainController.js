const Project = require('../models/ProjectSchema');
const get_project = async(req, res, next) => {
   //Database Get Projects
   const projects = await Project.find();
  try {
    //Database Get Projects
    res.status(200).json({
      status: "success",
      data: projects
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
const add_project = async(req, res, next) => { 
  const data = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
  }   
  try {
    //Database POST Project
    const project = await Project.create(data)
    res.status(201).json({
      status: "success",
      data:  project
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const single_project = async (req, res) => {
  //const name = req.params.name;
  //console.log(req.params.name);
  const id= req.params.id;
  const project = await Project.findById(id); 
  try {
    //Database Get Projects
    res.status(201).json({
      status: "success",
      data:project
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};


const update_project = async (req, res) => {
    const id = req.params.id;
    const data = req.body
    const project= await Project.findByIdAndUpdate(id,data, {new: true});
  try {
    //Database Get Projects
    res.status(200).json({
      status: "success",
      data: project
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
const delete_project = async (req, res) => {
    const id = req.params.id;
    const project = await Project.findByIdAndDelete(id);
  try {
    //Database Get Projects
    res.status(200).json({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

module.exports = {get_project, add_project, single_project, update_project, delete_project}