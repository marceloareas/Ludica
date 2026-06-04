const router = require('express').Router();

const controller = require('../controllers/friendsController');

router.post('/enviar', controller.enviar);
router.put('/aceitar', controller.aceitar);
router.get('/pendentes/:id_usuario', controller.listarPendentes);
router.get('/enviados/:id_usuario', controller.listarEnviados);
router.get('/:id_usuario', controller.listar);
router.delete('/delete', controller.remover);
router.put('/recusar', controller.recusar);

module.exports = router;