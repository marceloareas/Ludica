const db = require('../db/db');

const gamesService = require('../services/gamesService');

exports.create = async (req, res) => {

    try {

        const game = await gamesService
            .createGame(req.body);

        res.status(201).json(game);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

exports.getAll = async (req, res) => {

    try {

        const userId = 1;

        const result = await db.query(`
            SELECT
                j.id_jogo,
                j.titulo,
                j.descricao,

                COALESCE(p.pontos_acumulados, 0) AS pontuacao,

                MAX(h.data_partida) AS ultimo_acesso,

                j.url_imagem AS IMAGEM

            FROM jogo j

            LEFT JOIN pontuacao p
                ON j.id_jogo = p.id_jogo
                AND p.id_usuario = $1

            LEFT JOIN historico_partida h
                ON j.id_jogo = h.id_jogo
                AND h.id_usuario = $1

            GROUP BY
                j.id_jogo,
                j.titulo,
                j.descricao,
                p.pontos_acumulados

            ORDER BY j.id_jogo;
        `, [userId]);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Erro ao buscar jogos'
        });
    }
};

exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await gamesService.getGameById(id);

    if (!game) {
      return res.status(404).json({
        error: "Jogo não encontrado",
      });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
};