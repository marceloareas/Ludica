const router = require('express').Router();

const controller = require('../controllers/historyController');

router.post('/', controller.create);

router.get('/:id_usuario', controller.getByUser);

router.get('/game/:id_jogo', controller.getByGame);

router.get('/:id_usuario/:id_jogo', controller.getByUserAndGame);

module.exports = router;