const Joi = require("joi");

const schema = Joi.object({
  lastname: Joi.string(),
  firstname: Joi.string(),
  name: Joi.string(),
  detail: Joi.string(),
  email: Joi.string().email(),
  clientId: Joi.number().integer().positive(),
  freelanceId: Joi.number().integer().positive(),
  estimatedCost: Joi.number().integer().positive(),
  societyName: Joi.string(),
  phoneNumber: Joi.number().integer(),
  expTitle: Joi.string(),
  expContent: Joi.string(),
  endExpDate: Joi.date(),
  startExpDate: Joi.date(),
  birthdate: Joi.date(),
  expertise: Joi.string(),
});

module.exports = (req, res, next) => {
  const lastname = req.body.lastname;
  const firstname = req.body.firstname;
  const email = req.body.email;
  const clientId = req.body.clientId;
  const name = req.body.name;
  const detail = req.body.detail;
  const estimatedCost = req.body.estimatedcost;
  const societyName = req.body.societyname;
  const phoneNumber = req.body.phoneNumber;
  const expTitle = req.body.expTitle;
  const expContent = req.body.expContent;
  const endExpDate = req.body.endExpDate;
  const startExpDate = req.body.startExpDate;
  const freelanceId = req.body.freelanceid;
  const birthdate = req.body.birthdate;
  const expertise = req.body.expertise;

  const { error } = schema.validate({
    lastname: lastname,
    firstname: firstname,
    email: email,
    clientId: clientId,
    name: name,
    detail: detail,
    estimatedCost: estimatedCost,
    societyName: societyName,
    phoneNumber: phoneNumber,
    expContent: expTitle,
    expContent: expContent,
    endExpDate: endExpDate,
    startExpDate: startExpDate,
    freelanceId: freelanceId,
    birthdate: birthdate,
    expertise: expertise,
  });

  if (error) {
    return res.status(400).json({ error });
  } else {
    next();
  }
};
