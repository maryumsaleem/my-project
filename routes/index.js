const express = require("express");
const router = express.Router();
const {
  get_project,
  add_project,
  single_project,
  update_project,
  delete_project,
} = require("../controllers/MainController");
const {
  login,
  signup,
  protect,
  restrictTo,
  resetPassword,
  newPassword,
} = require("../controllers/AuthController");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");
const {
  input_category,
  get_category,
  // getCategoryById,
  // updateCategory,
  // deleteCategory,
} = require("../controllers/categoryController");
const upload = require("../middleware/multerMiddleware");

router.get("/", get_project);
router.post("/", upload.single("image"), add_project);
router.get("/:id", single_project);
router.patch("/:id", update_project);
router.delete("/:id", delete_project);
router.post("/login", login);
router.post("/signup", signup);
router.post("/reset-Password", resetPassword);
router.post("/new-Password", newPassword);

// /***  products route   ****/
router.post("/products", createProduct);
router.get("/products", getAllProducts);
router.get("/:id", getProductById);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// /***  category route   ****/
router.post("/category", input_category);
router.get("/category", get_category);
// router.get("/:id", getCategoryById);
// router.patch("/:id", updateCategory);
// router.delete("/:id", deleteCategory);

router.get("/",(req,res)=>{
  res.send("abc")
})
module.exports = router;
