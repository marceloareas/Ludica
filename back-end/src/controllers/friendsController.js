const friendsService = require('../services/friendsService');

exports.enviar = async (req, res) => {
    try {
        const friend = await friendsService.enviarSolicitacao(
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
        const friend = await friendsService.aceitarSolicitacao(
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
        const amigos = await friendsService.listarAmigos(
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
            await friendsService.listarSolicitacoesPendentes(
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
            await friendsService.listarSolicitacoesEnviadas(
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
    const amizade = await friendsService.removerAmizade(
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
    const amizade = await friendsService.recusarSolicitacao(
      req.body.id_usuario_1,
      req.body.id_usuario_2
    );

    res.json(amizade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.obterRankingPorJogo = async (req, res) => {
  try {
    const { id_usuario, id_jogo } = req.params;

    const ranking = await friendsService.obterRankingPorJogo(
      Number(id_usuario),
      Number(id_jogo)
    );

    return res.status(200).json(ranking);

  } catch (error) {
    console.error("ERRO RANKING:", error);
    return res.status(500).json({ error: error.message });
  }
};