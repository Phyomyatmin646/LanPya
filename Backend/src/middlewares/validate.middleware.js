const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(422).json(ApiResponse.error(messages.join(", "), 422));
  }
  next();
};

module.exports = validate;
