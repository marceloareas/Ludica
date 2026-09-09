const db = require('../db/db.js');

exports.createGame = async (data) => {

    const result = await db.query(
        `INSERT INTO jogo
        (
            codigo_jogo,
            titulo,
            descricao,
            url_recurso,
            id_admin_criador,
            data_criacao
        )
        VALUES ($1,$2,$3,$4,$5,NOW())
        RETURNING *`,
        [
            data.codigo_jogo,
            data.titulo,
            data.descricao,
            data.url_recurso,
            data.id_admin_criador
        ]
    );

    return result.rows[0];
};

exports.getAllGames = async () => {

    const result = await db.query(
        `SELECT * FROM jogo`
    );

    return result.rows;
};

exports.getGameById = async (id) => {
  const result = await db.query(
    `SELECT
       id_jogo,
       codigo_jogo,
       titulo,
       descricao,
       tempo_estimado,
       faixa_etaria,
       quantidade_jogadores,
       url_recurso,
       url_imagem,
       id_admin_criador,
       data_criacao
     FROM jogo
     WHERE id_jogo = $1`,
    [id]
  );

  return result.rows[0];
};

exports.deleteGame = async (id) => {

    await db.query(
        `DELETE FROM jogo
         WHERE id_jogo = $1`,
        [id]
    );
};
