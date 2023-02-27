const router = require('express').Router();
const {
  usersRegistration,
  userLogin,
  userLogout,
  currentUser,
  updateSubscription,
  updateAvatar,
} = require('../../controllers/users');
const { authenticate } = require('../../middlewares/authenticate');
const { validateBody } = require('../../middlewares/validateBody');
const upload = require('../../middlewares/upload');
const { schemaRegistration, schemaLogin, schemUpdateSubscription } = require('../../models/users');

router.post('/register', validateBody(schemaRegistration), usersRegistration);

router.post('/login', validateBody(schemaLogin), userLogin);

router.post('/logout', authenticate, userLogout);

router.get('/current', authenticate, currentUser);

router.patch('/', authenticate, validateBody(schemUpdateSubscription), updateSubscription);

router.patch('/avatar', authenticate, upload.single('avatar'), updateAvatar);

module.exports = router;
