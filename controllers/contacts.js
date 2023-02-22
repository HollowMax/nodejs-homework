const { contacts } = require('../models/contacts');
const { HttpError } = require('../helpers/HttpError');
const ctrl = require('../helpers/cntrlWraper');

const getAll = async (req, res, next) => {
  res.json(await contacts.find({}, '-createdAt -updatedAt -__v'));
};

const getById = async (req, res, next) => {
  const result = await contacts.findById(req.params.contactId, '-createdAt -updatedAt -__v');
  if (!result) throw HttpError('Id not found', 404);
  res.json(result);
};

const add = async (req, res, next) => {
  const body = req.body;
  const result = await contacts.create(body);
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const result = await contacts.findByIdAndRemove(req.params.contactId);
  if (!result) throw HttpError('Id not found', 404);
  res.json({
    message: 'Contact deleted',
  });
};

const update = async (req, res, next) => {
  const body = req.body;
  const result = await contacts.findByIdAndUpdate(req.params.contactId, body, {
    new: true,
    select: '-createdAt -updatedAt -__v',
  });
  if (!result) throw HttpError('Id not found', 404);
  res.json(result);
};

const updateStatusContact = async (req, res, next) => {
  const body = req.body;
  const result = await contacts.findByIdAndUpdate(req.params.contactId, body, {
    new: true,
    select: '-createdAt -updatedAt -__v',
  });
  if (!result) throw HttpError('Id not found', 404);
  res.json(result);
};

module.exports = {
  getAll: ctrl(getAll),
  getById: ctrl(getById),
  add: ctrl(add),
  deleteContact: ctrl(deleteContact),
  update: ctrl(update),
  updateStatusContact: ctrl(updateStatusContact),
};
