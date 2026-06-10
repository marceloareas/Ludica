const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/buscar/:query', userController.searchUsers);
router.get('/:id/avatar', userController.getUserWithAvatar);

router.put('/:id/password', userController.changePassword);

module.exports = router;