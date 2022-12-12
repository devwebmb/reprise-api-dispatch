const express = require("express");
const multer = require("../../middlewares/multer-config");
const multipleFileMulter = require("../../middlewares/multifile-multer");
const passwordValidator = require("../../middlewares/password-validator");
const failleSqlValidator = require("../../middlewares/failleSql-middleware")

const router = express.Router();

const clientctrl = require("../../controllers/client/client");

//post
router.post("/client/signup",passwordValidator,failleSqlValidator, clientctrl.signup);
router.post("/client/login", failleSqlValidator, clientctrl.login);

//get
router.get("/clients", clientctrl.getAllClients);
router.get("/client/:id", clientctrl.getOneClient);

//update
router.put(
  "/client/update/:id",
  multer,
  failleSqlValidator,
  clientctrl.updateClientData
);

//delete
router.delete(`/client/delete/:id`, clientctrl.deleteOneClient);

module.exports = router;
