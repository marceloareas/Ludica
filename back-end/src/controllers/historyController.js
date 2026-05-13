const historyService = require('../services/historyService');

exports.create = async (req, res) => {

    try {

        const history = await historyService
            .registrarPartida(
                req.body.id_usuario,
                req.body.id_jogo,
                req.body.pontos_obtidos
            );

        res.json(history);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

exports.getByUser = async (req, res) => {

    const history = await historyService
        .gethistoryUsuario(req.params.id_usuario);

    res.json(history);
};

exports.getByGame = async (req, res) => {
    try {
        const history = await historyService
            .getHistoryByGame(req.params.id_jogo);

        res.json(history);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getByUserAndGame = async (req, res) => {
    try {
        const history = await historyService
            .getHistoryByUserAndGame(
                req.params.id_usuario,
                req.params.id_jogo
            );

        res.json(history);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};