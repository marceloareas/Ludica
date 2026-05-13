const router = require('express').Router();

const controller = require('../controllers/scoreController');

router.post('/', controller.add);

router.get('/ranking/:id_jogo', controller.ranking);

module.exports = router;