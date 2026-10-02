const router = require('express').Router();
const controller = require('../controllers/avatarController');
const { authenticate, onlyOwner } = require('../middleware/auth');

router.get('/:id', controller.getAvatar);
router.post('/:id', authenticate, onlyOwner, controller.saveAvatar);

module.exports = router;