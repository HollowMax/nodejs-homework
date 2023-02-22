const { HttpError } = require('../helpers/HttpError');
const { isValidObjectId } = require('mongoose');

const isValid = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(HttpError('Not valid id', 404));
  }
  next();
};

module.exports = {
  isValid,
};
