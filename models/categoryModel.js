const mongoose=require('mongoose');

let categorySchema = new mongoose.Schema({
    name: { 
      type: String,
      required: [true, "Category is required!"],
      unique: [true, "Category must be unique!"]
    },
    createdAt:{
      type: Date,
      default: Date.now(),
      select: false
    }
  });
  const Category = mongoose.model("Category", categorySchema);
  module.exports = Category;