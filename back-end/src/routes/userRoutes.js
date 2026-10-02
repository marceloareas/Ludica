const router = require('express').Router();
const userController = require('../controllers/userController');
const { authenticate, onlyOwner } = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/buscar/:query', userController.searchUsers);
router.get('/:id/avatar', userController.getUserWithAvatar);

router.put('/:id', authenticate, onlyOwner, userController.updateUser);
router.put('/:id/password', authenticate, onlyOwner, userController.changePassword);

module.exports = router;