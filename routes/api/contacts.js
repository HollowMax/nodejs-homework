const express = require('express');
const router = express.Router();
const { getAll, getById, add, deleteContact, update } = require('../../controllers/contacts');

router.get('/', getAll);

router.get('/:contactId', getById);

router.post('/', add);

router.delete('/:contactId', deleteContact);

router.put('/:contactId', update);

module.exports = router;
