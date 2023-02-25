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
const { authenticate } = require('../../middlewares/authenticate');
const { validateBody } = require('../../middlewares/validateBody');
const { schemaFullData, schemaFavorite } = require('../../models/contacts');

router.get('/', authenticate, getAll);

router.get('/:contactId', authenticate, isValid, getById);

router.post('/', authenticate, validateBody(schemaFullData), add);

router.delete('/:contactId', authenticate, isValid, deleteContact);

router.put('/:contactId', authenticate, isValid, validateBody(schemaFullData), update);

router.patch(
  '/:contactId/favorite',
  authenticate,
  isValid,
  validateBody(schemaFavorite, 'missing field favorite'),
  updateStatusContact
);

module.exports = router;
