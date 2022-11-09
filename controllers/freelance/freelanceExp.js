const fs = require("fs");

const db = require("../../database/dbConnection");

const responseBuilder = require("../../functions-controles/response-builders");
const errorsMessage = require("../../functions-controles/errors-variables");
const validMessages = require("../../functions-controles/valid-variables");

// Ajout d'une expérience de freelance
exports.addFreelanceExp = (req, res, next) => {
  const freelanceId = req.params.id;
  const expTitle = JSON.stringify(req.body.expTitle);
  const expContent = JSON.stringify(req.body.expContent);
  const startExpDate = JSON.stringify(req.body.startExpDate);
    const endExpDate = JSON.stringify(req.body.endExpDate);
    
    if (req.files) {
        console.log("req.files");
    } else {
        console.log("nothing");
    }

};
