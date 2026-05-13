const db = require('../db/db.js');

exports.createGame = async (data) => {

    const result = await db.query(
        `INSERT INTO jogos
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
        `SELECT * FROM jogos`
    );

    return result.rows;
};

exports.getGameById = async (id) => {

    const result = await db.query(
        `SELECT * FROM jogos
         WHERE id_jogo = $1`,
        [id]
    );

    return result.rows[0];
};

exports.deleteGame = async (id) => {

    await db.query(
        `DELETE FROM jogos
         WHERE id_jogo = $1`,
        [id]
    );
};
