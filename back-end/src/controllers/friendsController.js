const friendService = require('../services/friendsService');

exports.enviar = async (req, res) => {

    try {

        const friend = await friendService
            .enviarSolicitacao(
                req.body.id_usuario_1,
                req.body.id_usuario_2
            );

        res.json(friend);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

exports.aceitar = async (req, res) => {

    const friend = await friendService
        .aceitarSolicitacao(
            req.body.id_usuario_1,
            req.body.id_usuario_2
        );

    res.json(friend);
};

exports.listar = async (req, res) => {

    const amigos = await friendService
        .listarAmigos(req.params.id_usuario);

    res.json(amigos);
};