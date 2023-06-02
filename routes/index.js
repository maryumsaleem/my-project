const express = require("express");
const router = express.Router();
const { get_project, add_project, single_project, update_project, delete_project } = require('../controllers/MainController')
const {checkLogin,signup}=require('../controllers/AuthController');
const {verifyToken}=require('../middleware/verifyToken');
const upload = require("../middleware/multerMiddleware");

router.get("/", verifyToken,get_project);
router.post("/", upload.single('image'), add_project);
router.get("/:id",verifyToken, single_project); 
router.patch("/:id", update_project);
router.delete("/:id", delete_project);
router.post('/login',checkLogin);
router.post('/signup',signup);


module.exports = router;