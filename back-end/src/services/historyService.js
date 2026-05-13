const db = require('../db/db.js');

exports.registrarPartida = async (
    id_usuario,
    id_jogo,
    pontos_obtidos
) => {

    const result = await db.query(
        `INSERT INTO historico_partidas
        (
            id_usuario,
            id_jogo,
            pontos_obtidos
        )
        VALUES ($1,$2,$3)
        RETURNING *`,
        [
            id_usuario,
            id_jogo,
            pontos_obtidos
        ]
    );

    return result.rows[0];
};

exports.getHistoryByGame = async (id_jogo) => {

    const result = await db.query(`
        SELECT 
            hp.pontos_obtidos,
            hp.data_partida,
            u.nome_usuario
        FROM historico_partidas hp
        JOIN usuarios u
            ON u.id_usuario = hp.id_usuario
        WHERE hp.id_jogo = $1
        ORDER BY hp.data_partida DESC
    `, [id_jogo]);

    return result.rows;
};

exports.getHistoryByUserAndGame = async (
    id_usuario,
    id_jogo
) => {

    const result = await db.query(
        `
        SELECT
            *
        FROM historico_partidas
        WHERE id_usuario = $1
        AND id_jogo = $2
        ORDER BY data_partida DESC
        `,
        [id_usuario, id_jogo]
    );

    return result.rows;
};