const express = require("express");
const router = express.Router();
const { get_project, add_project, single_project, update_project, delete_project } = require('../controllers/MainController')
const {checkLogin}=require('../controllers/AuthController');
const {verifyToken}=require('../middleware/verifyToken');



router.get("/", verifyToken,get_project);
router.post("/", add_project);
router.get("/:id",verifyToken, single_project); 
router.patch("/:id", update_project);
router.delete("/:id", delete_project);
router.post('/login',checkLogin);


module.exports = router;