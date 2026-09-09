const historyService = require('../services/historyService');

exports.create = async (req, res) => {

    try {

        const history = await historyService
            .registrarPartida(
                req.body.id_usuario,
                req.body.id_jogo,
                req.body.pontos_obtidos
            );

        res.status(201).json(history);

    } catch (error) {

        if (
            error.message ===
            'Professor não pode participar de partidas'
        ) {
            return res.status(403).json({
                error: error.message
            });
        }

        if (
            error.message ===
            'Usuário não encontrado'
        ) {
            return res.status(404).json({
                error: error.message
            });
        }

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