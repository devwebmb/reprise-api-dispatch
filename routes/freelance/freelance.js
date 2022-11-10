const express = require("express");
const multer = require("../../middlewares/multer-config");
const multipleFileMulter = require("../../middlewares/multifile-multer");

const router = express.Router();

const freelanceCtrl = require("../../controllers/freelance/freelance");
const freelanceExpCtrl = require("../../controllers/freelance/freelanceExp");

//Post
router.post("/freelance/signup", freelanceCtrl.signup);
router.post("/freelance/login", freelanceCtrl.login);

router.post(
  "/freelanceExp",
  multipleFileMulter,
  freelanceExpCtrl.addFreelanceExp
);

//get
router.get("/freelance", freelanceCtrl.getAllFreelances);
router.get("/freelance/:id", freelanceCtrl.getOneFreelance);

//put
router.put("/freelance/update/:id", multer, freelanceCtrl.updateFreelanceData);

router.put(
  "/freelanceexp/update/:id",
  multipleFileMulter,
  freelanceExpCtrl.updateFreelanceExp
);

//delete
router.delete("/freelanceExp/:id", freelanceExpCtrl.deleteOneFreelanceExp);
router.delete("/freelance/:id", freelanceCtrl.deleteFreelance);

module.exports = router;
