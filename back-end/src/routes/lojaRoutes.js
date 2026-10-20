const router = require('express').Router();
const controller = require('../controllers/lojaController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);

router.get('/itens', controller.listarItens);
router.get('/carteira', controller.carteira);
router.post('/comprar/:idItem', controller.comprar);

router.post('/admin/usuarios/:id/moedas', requireAdmin, controller.ajustarMoedas);

module.exports = router;