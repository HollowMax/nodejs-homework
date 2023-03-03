const router = require('express').Router();
const {
  sendVerification,
  verifyUser,
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
const {
  schemaRegistration,
  schemaLogin,
  schemUpdateSubscription,
  schemEmailVerification,
} = require('../../models/users');

router.get('/current', authenticate, currentUser);

router.get('/verify/:verificationToken', verifyUser);

router.post(
  '/verify',
  validateBody(schemEmailVerification, 'Missing required field email'),
  sendVerification
);

router.post('/register', validateBody(schemaRegistration), usersRegistration);

router.post('/login', validateBody(schemaLogin), userLogin);

router.post('/logout', authenticate, userLogout);

router.patch('/', authenticate, validateBody(schemUpdateSubscription), updateSubscription);

router.patch('/avatar', authenticate, upload.single('avatar'), updateAvatar);

module.exports = router;
