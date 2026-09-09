const db = require('../db/db.js');

exports.registrarPartida = async (
    id_usuario,
    id_jogo,
    pontos_obtidos
) => {

    const userResult = await db.query(
        `
        SELECT
            tipo_usuario,
            perfil_usuario
        FROM usuario
        WHERE id_usuario = $1
        `,
        [id_usuario]
    );

    const user = userResult.rows[0];

    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const podeJogar =
        user.tipo_usuario === 'Administrador' ||
        (
            user.tipo_usuario === 'Usuario' &&
            user.perfil_usuario === 'Aluno'
        );

    if (!podeJogar) {
        throw new Error(
            'Professor não pode participar de partidas'
        );
    }

    const result = await db.query(
        `
        INSERT INTO historico_partida
        (
            id_usuario,
            id_jogo,
            pontos_obtidos
        )
        VALUES ($1,$2,$3)
        RETURNING *
        `,
        [
            id_usuario,
            id_jogo,
            pontos_obtidos
        ]
    );

    return result.rows[0];
};

exports.getHistoryByGame = async (id_jogo) => {

    const result = await db.query(
        `
        SELECT 
            hp.pontos_obtidos,
            hp.data_partida,
            u.nome_usuario
        FROM historico_partida hp
        JOIN usuario u
            ON u.id_usuario = hp.id_usuario
        WHERE hp.id_jogo = $1
        ORDER BY hp.data_partida DESC
        `,
        [id_jogo]
    );

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
        FROM historico_partida
        WHERE id_usuario = $1
        AND id_jogo = $2
        ORDER BY data_partida DESC
        `,
        [id_usuario, id_jogo]
    );

    return result.rows;
};