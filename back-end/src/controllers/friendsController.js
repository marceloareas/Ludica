const friendService = require('../services/friendsService');

exports.enviar = async (req, res) => {
    console.log(req)
    try {
        const friend = await friendService.enviarSolicitacao(
            req.body.id_usuario_1,
            req.body.id_usuario_2
        );

        res.status(201).json(friend);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.aceitar = async (req, res) => {
    try {
        const friend = await friendService.aceitarSolicitacao(
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

exports.listar = async (req, res) => {
    try {
        const amigos = await friendService.listarAmigos(
            req.params.id_usuario
        );

        res.json(amigos);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.listarPendentes = async (req, res) => {
    try {
        const solicitacoes =
            await friendService.listarSolicitacoesPendentes(
                req.params.id_usuario
            );

        res.json(solicitacoes);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.listarEnviados = async (req, res) => {
    try {
        const solicitacoes =
            await friendService.listarSolicitacoesEnviadas(
                req.params.id_usuario
            );

        res.json(solicitacoes);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.remover = async (req, res) => {
  try {
    const amizade = await friendService.removerAmizade(
      req.body.id_usuario_1,
      req.body.id_usuario_2
    );

    res.json(amizade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.recusar = async (req, res) => {
  try {
    const amizade = await friendService.recusarSolicitacao(
      req.body.id_usuario_1,
      req.body.id_usuario_2
    );

    res.json(amizade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};