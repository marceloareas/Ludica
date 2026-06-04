const db = require('../db/db.js');

exports.enviarSolicitacao = async (
    id_usuario_1,
    id_usuario_2
) => {

    if (id_usuario_1 === id_usuario_2) {
        throw new Error('Não é possível adicionar a si mesmo.');
    }

    const amizadeExistente = await db.query(
        `SELECT *
         FROM amizade
         WHERE (
            id_usuario_1 = $1
            AND id_usuario_2 = $2
         )
         OR (
            id_usuario_1 = $2
            AND id_usuario_2 = $1
         )`,
        [id_usuario_1, id_usuario_2]
    );

    if (amizadeExistente.rowCount > 0) {
        throw new Error('Já existe uma solicitação ou amizade entre esses usuários.');
    }

    const result = await db.query(
        `INSERT INTO amizade (
            id_usuario_1,
            id_usuario_2,
            status,
            data_conexao
        )
        VALUES ($1, $2, 'Pendente', NOW())
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
         AND status = 'Pendente'
         RETURNING *`,
        [id_usuario_1, id_usuario_2]
    );

    if (result.rowCount === 0) {
        throw new Error('Solicitação não encontrada.');
    }

    return result.rows[0];
};

exports.listarAmigos = async (id_usuario) => {

    const result = await db.query(
        `SELECT
            u.id_usuario,
            u.nome_usuario
         FROM usuarios u
         JOIN (
            SELECT
                CASE
                    WHEN id_usuario_1 = $1
                    THEN id_usuario_2
                    ELSE id_usuario_1
                END AS id_amigo
            FROM amizade
            WHERE (
                id_usuario_1 = $1
                OR id_usuario_2 = $1
            )
            AND status = 'Aceito'
         ) amigos
         ON u.id_usuario = amigos.id_amigo`,
        [id_usuario]
    );

    return result.rows;
};

exports.listarSolicitacoesPendentes = async (id_usuario) => {

    const result = await db.query(
        `SELECT
            a.id_usuario_1,
            u.nome_usuario,
            a.data_conexao
         FROM amizade a
         JOIN usuarios u
            ON u.id_usuario = a.id_usuario_1
         WHERE a.id_usuario_2 = $1
         AND a.status = 'Pendente'`,
        [id_usuario]
    );

    return result.rows;
};

exports.listarSolicitacoesEnviadas = async (id_usuario) => {
    const result = await db.query(
        `SELECT
            a.id_usuario_2,
            u.nome_usuario,
            a.data_conexao
         FROM amizade a
         JOIN usuarios u
            ON u.id_usuario = a.id_usuario_2
         WHERE a.id_usuario_1 = $1
         AND a.status = 'Pendente'`,
        [id_usuario]
    );

    return result.rows;
};

exports.removerAmizade = async (id1, id2) => {
  const result = await db.query(
    `
    DELETE FROM amizade
    WHERE (
      id_usuario_1 = $1 AND id_usuario_2 = $2
    )
    OR (
      id_usuario_1 = $2 AND id_usuario_2 = $1
    )
    RETURNING *;
    `,
    [id1, id2]
  );

  return result.rows[0];
};

exports.recusarSolicitacao = async (id_remetente, id_destinatario) => {
    const result = await db.query(
        `
        UPDATE amizade
        SET status = 'Recusado'
        WHERE (
            id_usuario_1 = $1 AND id_usuario_2 = $2
        )
        AND status = 'Pendente'
        RETURNING *;
        `,
        [id_remetente, id_destinatario]
    );

    if (result.rowCount === 0) {
        throw new Error('Solicitação não encontrada');
    }

    return result.rows[0];
};