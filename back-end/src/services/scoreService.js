const db = require('../db/db.js');

exports.addScore = async (
    id_usuario,
    id_jogo,
    pontos
) => {

    const existe = await db.query(
        `SELECT * FROM pontuacao
         WHERE id_usuario = $1
         AND id_jogo = $2`,
        [id_usuario, id_jogo]
    );

    if (existe.rows.length > 0) {

        const result = await db.query(
            `UPDATE pontuacao
             SET pontos_acumulados =
             pontos_acumulados + $1
             WHERE id_usuario = $2
             AND id_jogo = $3
             RETURNING *`,
            [pontos, id_usuario, id_jogo]
        );

        return result.rows[0];
    }

    const result = await db.query(
        `INSERT INTO pontuacao
        (
            id_usuario,
            id_jogo,
            pontos_acumulados
        )
        VALUES ($1,$2,$3)
        RETURNING *`,
        [id_usuario, id_jogo, pontos]
    );

    return result.rows[0];
};

exports.getRankingByGame = async (id_jogo) => {

    const result = await db.query(
        `SELECT
            u.nome_usuario,
            p.pontos_acumulados
         FROM pontuacao p
         JOIN usuario u
         ON u.id_usuario = p.id_usuario
         WHERE p.id_jogo = $1
         ORDER BY p.pontos_acumulados DESC`,
        [id_jogo]
    );

    return result.rows;
};