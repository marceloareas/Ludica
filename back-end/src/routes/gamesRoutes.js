const router = require('express').Router();

const controller = require('../controllers/gamesController');

router.post('/', controller.create);

router.get('/', controller.getAll);

router.get("/:id", controller.getGameById);

module.exports = router;