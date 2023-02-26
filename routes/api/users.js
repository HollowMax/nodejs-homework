const router = require('express').Router();
const {
  usersRegistration,
  userLogin,
  userLogout,
  currentUser,
  updateSubscription,
} = require('../../controllers/users');
const { authenticate } = require('../../middlewares/authenticate');
const { validateBody } = require('../../middlewares/validateBody');
const { schemaRegistration, schemaLogin, schemUpdateSubscription } = require('../../models/users');

router.post('/register', validateBody(schemaRegistration), usersRegistration);

router.post('/login', validateBody(schemaLogin), userLogin);

router.post('/logout', authenticate, userLogout);

router.get('/current', authenticate, currentUser);

router.patch('/', authenticate, validateBody(schemUpdateSubscription), updateSubscription);

module.exports = router;
