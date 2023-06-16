const Project = require('../models/ProjectSchema');
const cloudinary = require("../utils/cloudinary");

const get_project = async(req, res, next) => {
   
  try {
    let queryObj = { ...req.query };
      let excludedFields = ["page", "limit", "sort", "fields"];
      excludedFields.forEach((field) => delete queryObj[field]);

      // Advance Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      console.log(JSON.parse(queryStr));
      let query = Project.find(JSON.parse(queryStr)).select("-password");

       // Sorting
       if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      //Fields Limiting

      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-__v");
      }

      //Pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 10;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);

      if (req.query.page) {
        const data = await Project.countDocuments();
        if (skip >= data) throw new Error("This page does not exist");
      }
      // Execute the Query
      const projects = await query;

      //
    //Database Get Projects
   //const projects = await Project.find().select("-password");
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

// const catchAsync = fn =>{
//   fn(req,res,next).catch(err =>next (err));
// }
const add_project = async (req, res, next) => { 
  try {
    if(!req.file) {
      return res.status(404).json({"status":"failed", "message":"image is required!"});
    }
    let Project_Image = await cloudinary.uploader.upload(req.file.path);
    console.log(Project_Image);
    const data = {
      name: req.body.name,
      email: req.body.email,
      image: Project_Image.secure_url,
      image_id: Project_Image.public_id,
      phone: req.body.phone,
      address: req.body.address,
    }   
    //Database POST Project
    const project = await Project.create(data)
    res.status(201).json({
      status: "success",
      data:  project
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

const single_project = async (req, res) => {
  //const name = req.params.name;
  //console.log(req.params.name);
  const id= req.params.id;
  const project = await Project.findById(id).select("-password -__v"); 
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