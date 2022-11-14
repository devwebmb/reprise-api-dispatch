const db = require("../../database/dbConnection");

const responseBuilder = require("../../functions-controles/response-builders");
const errorsMessage = require("../../functions-controles/errors-variables");
const validMessages = require("../../functions-controles/valid-variables");
const { json } = require("express");

//Ajouter une nouvelle mission

exports.addMission = (req, res, next) => {
  //Vérification présence données
  if (!req.body.name || !req.body.detail || !req.body.estimatedCost) {
    return res
      .status(400)
      .json(
        responseBuilder.buildErrorResponse(
          errorsMessage.emptyField.code,
          errorsMessage.emptyField.message
        )
      );
  }

  const mission = req.body;

  db.query(`INSERT INTO missions SET ?`, mission, (error, results) => {
    if (error) {
      res.status(400).json(error);
    }

    res
      .status(200)
      .json(
        responseBuilder.buildValidresponse(
          validMessages.createMission.message,
          results
        )
      );
  });
};

//Obtenir une mission
exports.getOneMission = (req, res, next) => {
  const missionId = req.params.id;

  db.query(`SELECT * FROM missions WHERE id=${missionId}`, (error, results) => {
    if (results.length === 0) {
      return res
        .status(404)
        .json(
          responseBuilder.buildErrorResponse(
            errorsMessage.missionNotFound.code,
            errorsMessage.missionNotFound.message
          )
        );
    } else if (results.length > 0) {
      return res
        .status(200)
        .json(
          responseBuilder.buildValidresponse(
            validMessages.getOneMission.message,
            results
          )
        );
    } else {
      return res
        .status(500)
        .json(
          responseBuilder.buildErrorResponse(
            errorsMessage.internalServerError.code,
            errorsMessage.internalServerError.message,
            { error }
          )
        );
    }
  });
};

//Obtenir toutes les missions
exports.getAllMissions = (req, res, next) => {
  db.query(`SELECT * FROM missions`, (error, results) => {
    if (error) {
      return res.status(400).json(error);
    }
    return res
      .status(200)
      .json(
        responseBuilder.buildValidresponse(
          validMessages.getAllMission.message,
          results
        )
      );
  });
};

//Obtenir toutes les missions d'un freelance
exports.getAllClientMissions = (req, res, next) => {
  const clientId = req.params.id;

  db.query(
    `SELECT * FROM missions WHERE clientId=${clientId}`,
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      return res
        .status(200)
        .json(
          responseBuilder.buildValidresponse(
            validMessages.getAllMissionClient.message,
            results
          )
        );
    }
  );
};

//Supprimer une mission
exports.deleteOneMission = (req, res, next) => {
  const missionId = req.params.id;

  db.query(`DELETE FROM missions WHERE id=${missionId}`, (error, results) => {
    if (error) {
      return res.status(400).json(error);
    }
    return res
      .status(200)
      .json(
        responseBuilder.buildValidresponse(
          validMessages.deleteOneMission.message
        )
      );
  });
};
