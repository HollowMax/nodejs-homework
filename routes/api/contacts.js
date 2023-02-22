const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  add,
  deleteContact,
  update,
  updateStatusContact,
} = require('../../controllers/contacts');
const { isValid } = require('../../middlewares/isValid');
const { validateBody } = require('../../middlewares/validateBody');
const { schemaFullData, schemaFavorite } = require('../../models/contacts');

router.get('/', getAll);

router.get('/:contactId', isValid, getById);

router.post('/', validateBody(schemaFullData), add);

router.delete('/:contactId', isValid, deleteContact);

router.put('/:contactId', isValid, validateBody(schemaFullData), update);

router.patch(
  '/:contactId/favorite',
  isValid,
  validateBody(schemaFavorite, 'missing field favorite'),
  updateStatusContact
);

module.exports = router;
