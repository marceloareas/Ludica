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
       j.id_jogo,
       j.codigo_jogo,
       j.titulo,
       j.descricao,
       j.tempo_estimado,
       j.faixa_etaria,
       j.quantidade_jogadores,
       j.url_recurso,
       j.url_imagem,
       j.id_admin_criador,
       u.nome_usuario AS autor,
       j.data_criacao
     FROM jogo j
     LEFT JOIN usuario u ON u.id_usuario = j.id_admin_criador
     WHERE j.id_jogo = $1`,
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
