const { HttpError } = require('../helpers/HttpError');

const validateBody = (schema, message = 'Not valid data') => {
  const fun = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw HttpError(message, 400);
    }
    next();
  };
  return fun;
};

module.exports = {
  validateBody,
};
