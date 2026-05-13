const db = require('../db/db.js');

exports.enviarSolicitacao = async (
    id_usuario_1,
    id_usuario_2
) => {

    const result = await db.query(
        `INSERT INTO amizade
        (
            id_usuario_1,
            id_usuario_2,
            status,
            data_conexao
        )
        VALUES ($1,$2,'Pendente',NOW())
        RETURNING *`,
        [id_usuario_1, id_usuario_2]
    );

    return result.rows[0];
};

exports.aceitarSolicitacao = async (
    id_usuario_1,
    id_usuario_2
) => {

    const result = await db.query(
        `UPDATE amizade
         SET status = 'Aceito'
         WHERE id_usuario_1 = $1
         AND id_usuario_2 = $2
         RETURNING *`,
        [id_usuario_1, id_usuario_2]
    );

    return result.rows[0];
};

exports.listarAmigos = async (id_usuario) => {

    const result = await db.query(
        `SELECT u.id_usuario, u.nome_usuario
         FROM amizade a
         JOIN usuarios u
         ON (
            u.id_usuario = a.id_usuario_1
            OR
            u.id_usuario = a.id_usuario_2
         )
         WHERE (
            a.id_usuario_1 = $1
            OR
            a.id_usuario_2 = $1
         )
         AND a.status = 'Aceito'
         AND u.id_usuario != $1`,
        [id_usuario]
    );

    return result.rows;
};