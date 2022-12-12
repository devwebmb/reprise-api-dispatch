const express = require("express");
const multer = require("../../middlewares/multer-config");
const multipleFileMulter = require("../../middlewares/multifile-multer");
const passwordValidator = require("../../middlewares/password-validator");
const failleSqlValidator = require("../../middlewares/failleSql-middleware")

const router = express.Router();

const freelanceCtrl = require("../../controllers/freelance/freelance");
const freelanceExpCtrl = require("../../controllers/freelance/freelanceExp");

//Post
router.post(
  "/freelance/signup",
  passwordValidator,
  failleSqlValidator,
  freelanceCtrl.signup
);
router.post("/freelance/login", freelanceCtrl.login);

router.post(
  "/freelanceExp",
  multipleFileMulter,
  failleSqlValidator,
  freelanceExpCtrl.addFreelanceExp
);

//get
router.get("/freelance", freelanceCtrl.getAllFreelances);
router.get("/freelance/:id", freelanceCtrl.getOneFreelance);

router.get("/freelanceExp/:id", freelanceExpCtrl.getOneExperience);
router.get(
  "/freelanceExp/allExperiences/:id",
  freelanceExpCtrl.getFreelanceExp
);

//put
router.put(
  "/freelance/update/:id",
  multer,
  failleSqlValidator,
  freelanceCtrl.updateFreelanceData
);

router.put(
  "/freelanceexp/update/:id",
  multipleFileMulter,
  failleSqlValidator,
  freelanceExpCtrl.updateFreelanceExp
);

//delete
router.delete("/freelanceExp/:id", freelanceExpCtrl.deleteOneFreelanceExp);
router.delete("/freelance/:id", freelanceCtrl.deleteFreelance);

module.exports = router;
