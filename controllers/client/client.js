const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
require("dotenv").config();

const db = require("../../database/dbConnection");

const responseBuilder = require("../../functions-controles/response-builders");
const errorsMessage = require("../../functions-controles/errors-variables");
const validMessages = require("../../functions-controles/valid-variables");

//inscription client
exports.signup = (req, res, next) => {
  //vérification du champs vide des données
  if (
    !req.body.email ||
    !req.body.password ||
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
  const client = req.body;
  bcrypt
    .hash(client.password, 10)
    .then((hash) => {
      console.log(hash);
      client.password = hash;
      db.query(`INSERT INTO clientdata SET ?`, client, (err, result, field) => {
        if (err) {
          const error = err.sqlMessage;
          return res.status(400).json({ error });
        }
        return res.status(201).json({
          message: "Le client a été ajouté à la base de données",
          result,
        });
      });
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

//Connexion client
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
    `SELECT * FROM clientdata WHERE email= ?`,
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
                validMessages.connectClient.message,
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
exports.getAllClients = (req, res, next) => {
  db.query(`SELECT * From clientdata`, (error, results) => {
    if (error) {
      return res.status(400).json(error);
    }
    return res
      .status(200)
      .json(
        responseBuilder.buildValidresponse(
          validMessages.getAllClients.message,
          results
        )
      );
  });
};

//Obtenir un freelance
exports.getOneClient = (req, res, next) => {
  const id = req.params.id;
  db.query(`SELECT * FROM clientdata WHERE id= ?`, id, (error, results) => {
    if (results.length === 0) {
      return res
        .status(404)
        .json(
          responseBuilder.buildErrorResponse(
            errorsMessage.clientNotFound.code,
            errorsMessage.clientNotFound.message
          )
        );
    } else if (results.length > 0) {
      return res
        .status(200)
        .json(
          responseBuilder.buildValidresponse(
            validMessages.getOneClient.message,
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
exports.updateClientData = (req, res, next) => {
  const clientId = req.params.id;
  const email = JSON.stringify(req.body.email);
  const lastname = JSON.stringify(req.body.lastname);
  const firstname = JSON.stringify(req.body.firstname);
  const societyName = JSON.stringify(req.body.societyName);
  const phoneNumber = JSON.stringify(req.body.phoneNumber);

  db.query(
    `SELECT * FROM freelancedata WHERE id=?`,
    clientId,
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
            const filename = results[0].profilImgUrl;
            fs.unlink(`images/clientProfil/${filename}`, () => {});
          }
          const file = JSON.stringify(`${req.file.filename}`);

          db.query(
            `UPDATE clientdata SET email=${email}, profilImgUrl=${file}, lastname=${lastname}, firstname=${firstname}, societyName=${societyName}, phoneNumber=${phoneNumber}  WHERE id=${clientId}`,
            (error, results) => {
              if (error) {
                return res.status(400).json(error);
              }
              return res
                .status(200)
                .json(
                  responseBuilder.buildValidresponse(
                    validMessages.updateClientProfilData,
                    results
                  )
                );
            }
          );
        } else if (!req.file) {
          db.query(
            `UPDATE clientdata SET email=${email}, lastname=${lastname}, firstname=${firstname},  societyName=${societyName}, phoneNumber=${phoneNumber}  WHERE id=${clientId}`,
            (error, results) => {
              if (error) {
                return res.status(400).json(error);
              }
              return res
                .status(200)
                .json(
                  responseBuilder.buildValidresponse(
                    validMessages.updateClientProfilData,
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

//effacer un client
exports.deleteOneClient = (req, res, next) => {
  const clientId = req.params.id;

  db.query(
    `SELECT * FROM clientdata WHERE id=${clientId}`,
    (error, results) => {
      if (results.length === 0) {
        return res
          .status(404)
          .json(
            responseBuilder.buildErrorResponse(
              errorsMessage.clientNotFound.message
            )
          );
      } else if (results.length > 0) {
        db.query(
          `DELETE FROM clientdata WHERE id=${clientId}`,
          (error, results) => {
            if (error) {
              return res.status(400).json(error);
            }
            db.query(
              `DELETE FROM missions WHERE clientId=${clientId}`,
              (error, results) => {
                if (error) {
                  return res.status(400).json(error);
                }
                return res
                  .status(200)
                  .json(
                    responseBuilder.buildValidresponse(
                      validMessages.deleteClient.message
                    )
                  );
              }
            );
          }
        );
      }
    }
  );
};
