const Product = require("../models/productsModel");

module.exports = {
  /***** create new product   *******/
  createProduct: async (req, res) => {
    try {
      const data = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: mongoose.Types.ObjectId(req.body.category),
        quantity: req.body.quantity,
      };

      const product = await Product.create(data);
      res.status(201).json({
        status: "success",
        data: project,
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: err,
      });
    }
  },

  /****   Retrieve all products     ****/
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json({
        status: "success",
        data: products,
      });
    } catch (err) {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    }
  },
  getProductById: async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Product.findById(id);
 
      res.status(201).json({
        status: "success",
        data: project,
      });
    } catch (err) {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    }
  },
  updateProduct:async(req,res)=>{
    const id = req.params.id;
    const data = req.body
    const product= await Product.findByIdAndUpdate(id,data, {new: true});
  try {
    //Database Get Projects
    res.status(200).json({
      status: "success",
      data: product
    });
  } catch (err) {
    
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
  },

  deleteProduct:async(req,res)=>{
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
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
  }
};
