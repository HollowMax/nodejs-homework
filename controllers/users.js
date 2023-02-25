const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ctrl = require('../helpers/cntrlWraper');
const { HttpError } = require('../helpers/HttpError');
const { users } = require('../models/users');

const usersRegistration = async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 8);
  const { email, subscription } = await users.create({ ...req.body, password });
  res.status(201).json({
    user: {
      email,
      subscription,
    },
  });
};

const userLogin = async (req, res, next) => {
  const user = await users.findOne({ email: req.body.email });
  const { KEY } = process.env;
  let validPassword;
  if (user) {
    validPassword = await bcrypt.compare(req.body.password, user.password);
  }
  if (!user || !validPassword) {
    throw HttpError('Email or password is wrong', 401);
  }
  const token = jwt.sign({ id: user._id }, KEY, { expiresIn: '23h' });
  await users.findByIdAndUpdate(user._id, { token });

  res.json({ token, user: { email: user.email, subscription: user.subscription } });
};

const userLogout = async (req, res, next) => {
  const { _id } = req.user;
  await users.findByIdAndUpdate(_id, { token: '' });
  res.status(201).json({ status: '204 No Content' });
};

const currentUser = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;
  const { _id, email } = req.user;
  await users.findByIdAndUpdate(_id, { subscription });
  res.json({ email, subscription });
};

module.exports = {
  usersRegistration: ctrl(usersRegistration),
  userLogin: ctrl(userLogin),
  userLogout: ctrl(userLogout),
  currentUser: ctrl(currentUser),
  updateSubscription: ctrl(updateSubscription),
};
