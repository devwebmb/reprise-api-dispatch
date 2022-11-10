const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
require("dotenv").config();

const db = require("../../database/dbConnection");

const responseBuilder = require("../../functions-controles/response-builders");
const errorsMessage = require("../../functions-controles/errors-variables");
const validMessages = require("../../functions-controles/valid-variables");

//inscription freelance
exports.signup = (req, res, next) => {
  //vérification du champs vide des données
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.birthdate ||
    !req.body.lastname ||
    !req.body.firstname
  ) {
    return res
      .status(400)
      .json(
        responseBuilder.buildErrorResponse(
          errorsMessage.emptyField.code,
          errorsMessage.emptyField.message
        )
      );
  }

  //Vérification du format de l'adresse email
  if (!emailValidator.validate(req.body.email)) {
    return res
      .status(400)
      .json(
        responseBuilder.buildErrorResponse(
          errorsMessage.invalidEmailFormat.code,
          errorsMessage.invalidEmailFormat.message
        )
      );
  }

  //hachage du mot de passe et création du freelance
  const freelance = req.body;
  bcrypt
    .hash(freelance.password, 10)
    .then((hash) => {
      freelance.password = hash;
      db.query(
        `INSERT INTO freelancedata SET ?`,
        freelance,
        (err, result, field) => {
          if (err) {
            const error = err.sqlMessage;
            return res.status(400).json({ error });
          }
          return res.status(201).json({
            message: "Le freelance a été ajouté à la base de données",
            result,
          });
        }
      );
    })
    .catch((error) =>
      res
        .status(500)
        .json(
          responseBuilder.buildErrorResponse(
            errorsMessage.internalServerError.code,
            errorsMessage.internalServerError.message,
            { error }
          )
        )
    );
};

//Connexion freelance
exports.login = (req, res, next) => {
  //Vérifier si les champs sont renseignés
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json(
        responseBuilder.buildErrorResponse(
          errorsMessage.emptyField.code,
          errorsMessage.emptyField.message
        )
      );
  }

  const email = req.body.email;
  const password = req.body.password;

  db.query(
    `SELECT * FROM freelancedata WHERE email= ?`,
    email,
    (error, results, fields) => {
      if (results.length > 0) {
        bcrypt.compare(password, results[0].password).then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json(
                responseBuilder.buildErrorResponse(
                  errorsMessage.invalidPassword.code,
                  errorsMessage.invalidPassword.message
                )
              );
          }
          const token = jwt.sign(
            // création d'un token d'authentification
            { userId: results[0].id },
            `${process.env.PRIVATE_KEY}`,
            {
              expiresIn: "24h",
            }
          );
          return res
            .status(200)
            .json(
              responseBuilder.buildValidresponse(
                validMessages.connectFreelance.message,
                { token, results }
              )
            );
        });
      } else if (results.length === 0) {
        return res
          .status(404)
          .json(
            responseBuilder.buildErrorResponse(
              errorsMessage.emailNotFound.code,
              errorsMessage.emailNotFound.message
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
    }
  );
};

//Obtenir tous les freelances
exports.getAllFreelances = (req, res, next) => {
  db.query(`SELECT * From freelancedata`, (error, results) => {
    if (error) {
      return res.status(400).json(error);
    }
    return res
      .status(200)
      .json(
        responseBuilder.buildValidresponse(
          validMessages.getAllfreelances.message,
          results
        )
      );
  });
};

//Obtenir un freelance
exports.getOneFreelance = (req, res, next) => {
  const id = req.params.id;
  db.query(`SELECT * FROM freelancedata WHERE id= ?`, id, (error, results) => {
    if (results.length === 0) {
      return res
        .status(404)
        .json(
          responseBuilder.buildErrorResponse(
            errorsMessage.freelanceNotFound.code,
            errorsMessage.freelanceNotFound.message
          )
        );
    } else if (results.length > 0) {
      return res
        .status(200)
        .json(
          responseBuilder.buildValidresponse(
            validMessages.getOneFreelance.message,
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

//Modifier un freelance
exports.updateFreelanceData = (req, res, next) => {
  const freelanceId = req.params.id;
  const email = JSON.stringify(req.body.email);
  const lastname = JSON.stringify(req.body.lastname);
  const firstname = JSON.stringify(req.body.firstname);
  const birthdate = JSON.stringify(req.body.birthdate);
  const societyName = JSON.stringify(req.body.societyName);
  const expertise = JSON.stringify(req.body.expertise);

  db.query(
    `SELECT * FROM freelancedata WHERE id=?`,
    freelanceId,
    (error, results) => {
      if (results.length === 0) {
        return res
          .status(404)
          .json(
            responseBuilder.buildErrorResponse(
              errorsMessage.freelanceNotFound.code,
              errorsMessage.freelanceNotFound.message
            )
          );
      } else if (results.length > 0) {
        if (req.file) {
          if (results[0].profilImgUrl) {
            // suppression de l'ancienne image si l'on change l'image
            const filename = results[0].profilImgUrl.split(
              "/images/freelanceProfil"
            )[1];
            fs.unlink(`images/freelanceProfil/${filename}`, () => {});
          }
          const file = JSON.stringify(`${req.file.filename}`);

          db.query(
            `UPDATE freelancedata SET email=${email}, profilImgUrl=${file}, lastname=${lastname}, firstname=${firstname}, birthdate=${birthdate}, societyName=${societyName}, expertise=${expertise}  WHERE id=${freelanceId}`,
            (error, results) => {
              if (error) {
                return res.status(400).json(error);
              }
              return res
                .status(200)
                .json(
                  responseBuilder.buildValidresponse(
                    validMessages.updateFreelanceProfilData,
                    results
                  )
                );
            }
          );
        } else if (!req.file) {
          db.query(
            `UPDATE freelancedata SET email=${email}, lastname=${lastname}, firstname=${firstname}, birthdate=${birthdate}, societyName=${societyName}  WHERE id=${freelanceId}`,
            (error, results) => {
              if (error) {
                return res.status(400).json(error);
              }
              return res
                .status(200)
                .json(
                  responseBuilder.buildValidresponse(
                    validMessages.updateFreelanceProfilData,
                    results
                  )
                );
            }
          );
        }
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

//Supprimer un freelance et ses expériences

exports.deleteFreelance = (req, res, next) => {
  const freelanceId = req.params.id;

  db.query(
    `SELECT * FROM freelancedata WHERE id=${freelanceId}`,
    (error, results) => {
      if (results.length === 0) {
        return res
          .status(404)
          .json(
            responseBuilder.buildErrorResponse(
              errorsMessage.freelanceNotFound.code,
              errorsMessage.freelanceNotFound.message
            )
          );
      } else if (results.length > 0) {
        if (results[0].profilImgUrl) {
          fs.unlink(
            `images/freelanceProfil/${results[0].profilImgUrl}`,
            () => {}
          );
        }
        db.query(
          `DELETE FROM freelancedata WHERE id=${freelanceId}`,
          (error, results) => {
            if (error) {
              return res.status(400).json(error);
            }
            db.query(
              `SELECT * FROM freelanceexp WHERE freelanceId=${freelanceId}`,
              (error, results) => {
                for (let i = 0; i < results.length; i++) {
                  if (results[i].imgUrl2) {
                    fs.unlink(
                      `images/freelanceExp/${results[i].imgUrl2}`,
                      () => {}
                    );
                  }
                  if (results[i].imgUrl1) {
                    fs.unlink(
                      `images/freelanceExp/${results[i].imgUrl1}`,
                      () => {}
                    );
                  }
                }
                db.query(
                  `DELETE FROM freelanceexp WHERE freelanceId=${freelanceId}`,
                  (error, results) => {
                    if (error) {
                      return res.status(400).json(error);
                    }
                    console.log(results);
                    return res
                      .status(200)
                      .json(
                        responseBuilder.buildValidresponse(
                          validMessages.deleteFreelance
                        )
                      );
                  }
                );
              }
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
