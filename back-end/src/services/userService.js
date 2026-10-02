const db = require('../db/db.js');
const bcrypt = require('bcrypt');

const PERFIS_VALIDOS = ['Aluno', 'Professor'];

function conflictError(message) {
    const err = new Error(message);
    err.status = 409;
    return err;
}

// Converte violação de unicidade do Postgres (código 23505) em erro 409
function translateUniqueViolation(err) {
    if (err.code !== '23505') {
        return err;
    }

    if (err.constraint && err.constraint.includes('email')) {
        return conflictError('E-mail já está em uso');
    }

    return conflictError('Gamertag já está em uso');
}
const jwt = require('jsonwebtoken');
const { SECRET } = require('../middleware/auth');


exports.getAll = async () => {
    const result = await db.query('SELECT * FROM usuario');
    return result.rows;
};


exports.register = async (data) => {
    const {
        email,
        name,
        password,
        birthDate,
        perfil_usuario
    } = data;

    const userName = (data.userName || '').trim();

    if (!userName) {
        throw new Error('Informe uma Gamertag');
    }

    const perfilUsuario = perfil_usuario || 'Aluno';

    if (!PERFIS_VALIDOS.includes(perfilUsuario)) {
        throw new Error('Perfil de usuário inválido. Use Aluno ou Professor');
    }

    // Verificação amigável (ignora maiúsculas/minúsculas)
    const existingUser = await db.query(
        `SELECT id_usuario
         FROM usuario
         WHERE LOWER(nome_usuario) = LOWER($1)`,
        [userName]
    );

    if (existingUser.rows.length > 0) {
        throw conflictError('Gamertag já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await db.query(
            `INSERT INTO usuario
            (
                email,
                nome_completo,
                nome_usuario,
                senha,
                data_nascimento,
                tipo_usuario,
                flag_usuario,
                perfil_usuario
            )
            VALUES ($1,$2,$3,$4,$5,'Usuario','A',$6)
            RETURNING id_usuario,
                      nome_usuario,
                      email,
                      nome_completo,
                      data_nascimento,
                      tipo_usuario,
                      perfil_usuario`,
            [
                email,
                name,
                userName,
                hashedPassword,
                birthDate,
                perfilUsuario
            ]
        );

        return result.rows[0];
    } catch (err) {
        // Cobre a corrida: o banco é a garantia final
        throw translateUniqueViolation(err);
    }
};


exports.login = async (login, password) => {
    if (!login || !password) {
        throw new Error('Informe gamertag ou e-mail e senha');
    }

    const result = await db.query(
        `SELECT * FROM usuario
         WHERE LOWER(nome_usuario) = LOWER($1)
            OR LOWER(email) = LOWER($1)`,
        [login.trim()]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const validPassword = await bcrypt.compare(
        password,
        user.senha
    );

    if (!validPassword) {
        throw new Error('Senha inválida');
    }

    const token = jwt.sign(
        {
            id: user.id_usuario,
            userName: user.nome_usuario
        },
        SECRET,
        {
            expiresIn: '1h'
        }
    );

    return {
        token,
        user: {
            id: user.id_usuario,
            userName: user.nome_usuario,
            email: user.email,
            nome_completo: user.nome_completo,
            data_nascimento: user.data_nascimento,
            perfil_usuario: user.perfil_usuario,
            tipo_usuario: user.tipo_usuario
        }
    };
};


exports.update = async (id, data) => {
    const userName = (data.userName || '').trim();
    const nomeCompleto = (data.nome_completo || '').trim();
    const email = (data.email || '').trim();

    if (!userName || !nomeCompleto || !email) {
        throw new Error('Gamertag, nome completo e e-mail são obrigatórios');
    }

    const existingUser = await db.query(
        `SELECT id_usuario
         FROM usuario
         WHERE LOWER(nome_usuario) = LOWER($1)
           AND id_usuario <> $2`,
        [userName, id]
    );

    if (existingUser.rows.length > 0) {
        throw conflictError('Gamertag já está em uso');
    }

    try {
        const result = await db.query(
            `UPDATE usuario
             SET nome_usuario = $1,
                 email = $2,
                 nome_completo = $3,
                 data_nascimento = $4
             WHERE id_usuario = $5
             RETURNING id_usuario,
                       nome_usuario,
                       email,
                       nome_completo,
                       to_char(data_nascimento, 'YYYY-MM-DD') AS data_nascimento`,
            [
                userName,
                email,
                nomeCompleto,
                data.data_nascimento || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            const err = new Error('Usuário não encontrado');
            err.status = 404;
            throw err;
        }

        return result.rows[0];
    } catch (err) {
        throw translateUniqueViolation(err);
    }
};


exports.remove = async (id) => {
    const result = await db.query(
        `DELETE FROM usuario
         WHERE id_usuario = $1
         RETURNING *`,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error('Usuário não encontrado');
    }
};


exports.getUserWithAvatar = async (id) => {
    const result = await db.query(
        `SELECT
            u.*,
            a.aparencia_json
         FROM usuario u
         LEFT JOIN avatar a
             ON u.id_usuario = a.id_usuario
         WHERE u.id_usuario = $1`,
        [id]
    );

    return result.rows[0];
};


exports.recusarSolicitacao = async (
    id_usuario_1,
    id_usuario_2
) => {
    const result = await db.query(
        `
        UPDATE amizade
        SET status = 'Recusado'
        WHERE id_usuario_1 = $1
          AND id_usuario_2 = $2
          AND status = 'Pendente'
        RETURNING *;
        `,
        [
            id_usuario_1,
            id_usuario_2
        ]
    );

    if (result.rowCount === 0) {
        throw new Error('Solicitação não encontrada');
    }

    return result.rows[0];
};


exports.searchByUserName = async (userName) => {
    const result = await db.query(
        `
        SELECT
            id_usuario,
            nome_usuario,
            email
        FROM usuario
        WHERE nome_usuario ILIKE $1
        LIMIT 10
        `,
        [`%${userName}%`]
    );

    return result.rows;
};


exports.changePassword = async (
    id,
    senhaAtual,
    novaSenha
) => {
    const userResult = await db.query(
        `SELECT *
         FROM usuario
         WHERE id_usuario = $1`,
        [id]
    );

    const user = userResult.rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    const senhaOk = await bcrypt.compare(
        senhaAtual,
        user.senha
    );

    if (!senhaOk) {
        throw new Error('Senha atual incorreta');
    }

    const hash = await bcrypt.hash(
        novaSenha,
        10
    );

    await db.query(
        `UPDATE usuario
         SET senha = $1
         WHERE id_usuario = $2`,
        [
            hash,
            id
        ]
    );

    return {
        message: 'Senha alterada com sucesso'
    };
};