const express = require("express");
const router = express.Router();
const { get_project, add_project, single_project, update_project, delete_project } = require('../controllers/MainController')



router.get("/", get_project);
router.post("/", add_project);
router.get("/:id", single_project); 
router.patch("/:id", update_project);
router.delete("/:id", delete_project);


module.exports = router;