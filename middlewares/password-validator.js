const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
    .is()
    .min(8) //minimum 8 caractères
    .is()
    .max(20) // maximum 20 caractères
    .has()
    .uppercase(1) //minimum une majuscult
    .has()
    .lowercase(1) // minimum une minuscule
    .has()
    .digits(1) //minimum un chiffre
    .has()
    .not()
    .spaces() // ne contient pas d'espace
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]) // n'est pas un de ces mots de passe
    
module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    return next();
  } else {
    return res.status(400).json({
      error:
        "Le mot de passe n'est pas assez fort ou contient des caractères non autorisés" +
        passwordSchema.validate("req.body.password", { list: true }),
    });
  }
};
