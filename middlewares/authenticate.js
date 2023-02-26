const jwt = require('jsonwebtoken');
const { HttpError } = require('../helpers/HttpError');
const ctrl = require('../helpers/cntrlWraper');
const { users } = require('../models/users');

const authenticate = async (req, res, next) => {
  const { KEY } = process.env;
  const { authorization = '' } = req.headers;
  const [bearer, token] = await authorization.split(' ');
  if (bearer != 'Bearer') {
    throw HttpError('Unauthorized1', 401);
  }
  const { id } = jwt.verify(token, KEY);
  const user = await users.findById(id);
  if (!user || !user.token || user.token !== token) {
    throw HttpError('Not authorized', 401);
  }
  req.user = user;
  next();
};

module.exports = {
  authenticate: ctrl(authenticate),
};
