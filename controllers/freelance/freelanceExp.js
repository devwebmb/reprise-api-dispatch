const fs = require("fs");

const db = require("../../database/dbConnection");

const responseBuilder = require("../../functions-controles/response-builders");
const errorsMessage = require("../../functions-controles/errors-variables");
const validMessages = require("../../functions-controles/valid-variables");

// Ajout d'une expérience de freelance
exports.addFreelanceExp = (req, res, next) => {
  const freelanceId = req.body.freelanceId;
  const expTitle = JSON.stringify(req.body.expTitle);
  const expContent = JSON.stringify(req.body.expContent);
  const startExpDate = JSON.stringify(req.body.startExpDate);
  const endExpDate = JSON.stringify(req.body.endExpDate);

  if (req.files.length > 0) {
    const file1 = req.files[0] ? `${req.files[0].filename}` : "";
    const file2 = req.files[1] ? `${req.files[1].filename}` : "";

    db.query(
      `INSERT INTO freelanceexp SET freelanceId=${freelanceId}, expTitle=${expTitle}, expContent=${expContent}, startExpDate=${startExpDate}, endExpDate=${endExpDate}, imgUrl1="${file1}",  imgUrl2="${file2}"`,
      (error, results) => {
        if (error) {
          return res.status(400).json(error);
        }
        return res
          .status(201)
          .json(
            responseBuilder.buildValidresponse(
              validMessages.addFreelanceExp.message,
              results
            )
          );
      }
    );
  } else if (req.files.length === 0) {
    db.query(
      `INSERT INTO freelanceexp SET freelanceId=${freelanceId}, expTitle=${expTitle}, expContent=${expContent}, startExpDate=${startExpDate}, endExpDate=${endExpDate}`,
      (error, results) => {
        if (error) {
          return res.status(400).json(error);
        }
        return res
          .status(201)
          .json(
            responseBuilder.buildValidresponse(
              validMessages.addFreelanceExp.message,
              results
            )
          );
      }
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
};

//Modification d'une expérience
exports.updateFreelanceExp = (req, res, next) => {
  const freelanceExpId = req.params.id;

  const expTitle = JSON.stringify(req.body.expTitle);
  const expContent = JSON.stringify(req.body.expContent);
  const startExpDate = JSON.stringify(req.body.startExpDate);
  const endExpDate = JSON.stringify(req.body.endExpDate);

  db.query(
    `SELECT * FROM freelanceexp WHERE id=${freelanceExpId}`,
    (error, results) => {
      if (results.length === 0) {
        return res
          .status(404)
          .json(
            responseBuilder.buildErrorResponse(
              errorsMessage.experienceNotFound.code,
              errorsMessage.experienceNotFound.message
            )
          );
      } else if (req.files.length > 0) {
        const file1 = req.files[0]
          ? `${req.files[0].filename}`
          : results.imgUrl1;
        const file2 = req.files[1]
          ? `${req.files[1].filename}`
          : results.imgUrl2;

        db.query(
          `UPDATE freelanceexp SET  expTitle=${expTitle}, expContent=${expContent}, startExpDate=${startExpDate}, endExpDate=${endExpDate}, imgUrl1="${file1}",  imgUrl2="${file2}"`,
          (error, results) => {
            if (error) {
              return res.status(400).json(error);
            }
            return res
              .status(201)
              .json(
                responseBuilder.buildValidresponse(
                  validMessages.updateFreelanceExp.message,
                  results
                )
              );
          }
        );
      } else if (req.files.length === 0) {
        db.query(
          `UPDATE freelanceexp SET  expTitle=${expTitle}, expContent=${expContent}, startExpDate=${startExpDate}, endExpDate=${endExpDate}"`,
          (error, results) => {
            if (error) {
              return res.status(400).json(error);
            }
            return res
              .status(201)
              .json(
                responseBuilder.buildValidresponse(
                  validMessages.updateFreelanceExp.message,
                  results
                )
              );
          }
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
    }
  );
};

//Effacer une expérience
exports.deleteOneFreelanceExp = (req, res, next) => {
  const freelanceExpId = req.params.id;

  db.query(
    `SELECT * FROM freelanceexp WHERE id=${freelanceExpId}`,
    (error, results) => {
      if (results.length === 0) {
        return res
          .status(404)
          .json(
            responseBuilder.buildErrorResponse(
              errorsMessage.experienceNotFound.code,
              errorsMessage.experienceNotFound.message
            )
          );
      } else if (results.length > 0) {
        if (results[0].imgUrl2) {
          fs.unlink(`images/freelanceExp/${results[0].imgUrl2}`, () => {});
        }
        if (results[0].imgUrl1) {
          fs.unlink(`images/freelanceExp/${results[0].imgUrl1}`, () => {});
        }

        db.query(
          `DELETE FROM freelanceexp WHERE id=${freelanceExpId}`,
          (error, results) => {
            if (error) {
              return res.status(400).json(error);
            }
            return res
              .status(200)
              .json(
                responseBuilder.buildValidresponse(
                  validMessages.deleteFreelanceExp.message,
                  results
                )
              );
          }
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
    }
  );
};

//Obtenir une expérience
exports.getOneExperience = (req, res, next) => {
  const expId = req.params.id;

  db.query(`SELECT * FROM freelanceexp WHERE id=${expId}`, (error, results) => {
    if (results.length === 0) {
      return res
        .status(404)
        .json(
          responseBuilder.buildErrorResponse(
            errorsMessage.experienceNotFound.code,
            errorsMessage.experienceNotFound.message
          )
        );
    } else if (results.length > 0) {
      return res
        .status(200)
        .json(
          responseBuilder.buildValidresponse(
            validMessages.getOneFreelanceExp.message,
            results
          )
        );
    }
  });
};

//obtenir toutes les experiences d'un freelance
exports.getFreelanceExp = (req, res, next) => {
  const freelanceId = req.params.id;

  db.query(
    `SELECT * FROM freelanceexp WHERE freelanceId=${freelanceId}`,
    (error, results) => {
      if (error) {
        return res.status(404).json(error);
      }
      return res
        .status(200)
        .json(
          responseBuilder.buildValidresponse(
            validMessages.getAllFreelanceExp.message,
            results
          )
        );
    }
  );
};
