const router = require('express').Router();
const controller = require('../controllers/avatarController');

router.get('/:id', controller.getAvatar);

router.post('/:id', controller.saveAvatar);

module.exports = router;