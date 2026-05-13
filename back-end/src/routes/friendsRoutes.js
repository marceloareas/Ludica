const router = require('express').Router();

const controller = require('../controllers/friendsController');

router.post('/enviar', controller.enviar);

router.post('/aceitar', controller.aceitar);

router.get('/:id_usuario', controller.listar);

module.exports = router;