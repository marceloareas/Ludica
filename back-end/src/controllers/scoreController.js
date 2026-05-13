const scoreService = require('../services/scoreService');

exports.add = async (req, res) => {

    try {

        const score = await scoreService
            .addscore(
                req.body.id_usuario,
                req.body.id_jogo,
                req.body.pontos
            );

        res.json(score);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

exports.ranking = async (req, res) => {

    const ranking = await scoreService
        .getRankingByGame(req.params.id_jogo);

    res.json(ranking);
};