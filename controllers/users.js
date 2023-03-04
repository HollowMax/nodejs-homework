const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');
const Path = require('path');
const ctrl = require('../helpers/cntrlWraper');
const { HttpError } = require('../helpers/HttpError');
const { users } = require('../models/users');
const sendEmail = require('../helpers/emailSender');

const verifyUser = async (req, res, next) => {
  const verificatedUser = await users.findOneAndUpdate(
    {
      verificationToken: req.params.verificationToken,
    },
    { verificationToken: null, verify: true }
  );

  if (!verificatedUser) {
    throw HttpError('User not found', 404);
  }

  res.json({ message: 'Verification successful' });
};

const sendVerification = async (req, res, next) => {
  const email = req.body.email;

  const user = await users.findOne({ email });

  const verificationToken = user.verificationToken;

  if (!user) {
    throw HttpError('User not found!', 404);
  }
  if (!user.verificationToken) {
    throw HttpError('Verification has already been passed', 400);
  }

  sendEmail(email, verificationToken);

  res.json({
    message: 'Verification email sent',
  });
};

const usersRegistration = async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 8);
  const avatarURL = gravatar.url(req.body.email, { d: 'mp' });
  const { email, subscription, verificationToken } = await users.create({
    ...req.body,
    password,
    avatarURL,
    verificationToken: uuidv4(),
  });

  sendEmail(email, verificationToken);

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
  if (!user.verify) {
    throw HttpError('Email not confirmed', 403);
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

const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    throw HttpError('Image not found', 404);
  }
  const { path, filename } = req.file;
  await jimp.read(path).then(image => image.resize(250, 250).write(path));

  const newName = req.user._id + '_' + filename;

  const dirName = Path.join(__dirname, '../public/avatars/', newName);
  await fs.rename(path, dirName);

  const avatarURL = req.protocol + '://' + req.get('host') + `/avatars/${newName}`;
  await users.findByIdAndUpdate(req.user._id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  verifyUser: ctrl(verifyUser),
  sendVerification: ctrl(sendVerification),
  usersRegistration: ctrl(usersRegistration),
  userLogin: ctrl(userLogin),
  userLogout: ctrl(userLogout),
  currentUser: ctrl(currentUser),
  updateSubscription: ctrl(updateSubscription),
  updateAvatar: ctrl(updateAvatar),
};
