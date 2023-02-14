const joi = require('joi');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../models/contacts');
const { HttpError } = require('../helpers/HttpError');
const ctrl = require('../helpers/cntrlWraper');

const schemaPost = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
});

const schemaPut = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
});

const getAll = async (req, res, next) => {
  res.json(await listContacts());
};

const getById = async (req, res, next) => {
  const result = await getContactById(req.params.contactId);
  if (!result) {
    next();
  }
  res.json(result);
};

const add = async (req, res, next) => {
  const body = req.body;
  const { error } = schemaPost.validate(body);
  if (error) {
    throw HttpError('missing required name field', 400);
  }
  res.status(201).json(await addContact(body));
};

const deleteContact = async (req, res, next) => {
  const result = await removeContact(req.params.contactId);
  if (!result) {
    next();
  }
  res.json(result);
};

const update = async (req, res, next) => {
  const body = req.body;
  const { error } = schemaPut.validate(body);
  if (error) {
    throw HttpError('missing fields', 400);
  }
  const result = await updateContact(req.params.contactId, body);
  if (!result) {
    return next();
  }
  res.json(result);
};

module.exports = {
  getAll: ctrl(getAll),
  getById: ctrl(getById),
  add: ctrl(add),
  deleteContact: ctrl(deleteContact),
  update: ctrl(update),
};
