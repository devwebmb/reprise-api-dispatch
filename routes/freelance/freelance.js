const express = require("express");
const multer = require("../../middlewares/multer-config");
const router = express.Router();

const freelanceCtrl = require("../../controllers/freelance/freelance");

//Post
router.post("/freelance/signup", freelanceCtrl.signup);
router.post("/freelance/login", freelanceCtrl.login);

//get
router.get("/freelance", freelanceCtrl.getAllFreelances)
router.get("/freelance/:id", freelanceCtrl.getOneFreelance)

//put
router.put("/freelance/update/:id",multer, freelanceCtrl.updateFreelanceData)

module.exports = router;
