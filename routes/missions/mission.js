const express = require("express");
const multer = require("../../middlewares/multer-config");
const multipleFileMulter = require("../../middlewares/multifile-multer");
const failleSqlValidator = require("../../middlewares/failleSql-middleware.js");

const router = express.Router();

const missionCtrl = require("../../controllers/missions/mission");

//post
router.post("/mission/addMission",failleSqlValidator, missionCtrl.addMission);

//get
router.get("/missions", missionCtrl.getAllMissions);
router.get("/mission/:id", missionCtrl.getOneMission);
router.get("/missions/client/:id", missionCtrl.getAllClientMissions);

//Delete
router.delete(`/mission/:id`,failleSqlValidator, missionCtrl.deleteOneMission);

module.exports = router;
