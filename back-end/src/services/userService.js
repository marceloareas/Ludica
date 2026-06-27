const db = require('../db/db.js');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const SECRET = 'segredo_super_secreto';


exports.getAll = async () => {
    const result = await db.query('SELECT * FROM usuario');
    return result.rows;
};

exports.register = async (data) => {
    const {
        email,
        name,
        userName,
        password,
        birthDate
    } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
        `INSERT INTO usuario 
        (email, nome_completo, nome_usuario, senha, data_nascimento, tipo_usuario, flag_usuario)
        VALUES ($1,$2,$3,$4,$5,'Jogador','A')
        RETURNING *`,
        [email, name, userName, hashedPassword, birthDate]
    );

    return result.rows[0];
};

exports.login = async (userName, password) => {
    const result = await db.query(
        `SELECT * FROM usuario WHERE nome_usuario = $1`,
        [userName]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const validPassword = await bcrypt.compare(password, user.senha);

    if (!validPassword) {
        throw new Error('Senha inválida');
    }

    const token = jwt.sign(
        { id: user.id_usuario, userName: user.nome_usuario },
        SECRET,
        { expiresIn: '1h' }
    );

    return {
        token,
        user: {
            id: user.id_usuario,
            userName: user.nome_usuario,
            email: user.email,
            nome_completo: user.nome_completo,
            data_nascimento: user.data_nascimento,
        }
    };
};

exports.update = async (id, data) => {
    const result = await db.query(
        `UPDATE usuario
         SET userName=$1, email=$2, nome_completo=$3
         WHERE id_usuario=$4
         RETURNING *`,
        [data.userName, data.email, data.nome_completo, id]
    );

    if (result.rows.length === 0) {
        throw new Error('Usuário não encontrado');
    }

    return result.rows[0];
};

exports.remove = async (id) => {
    const result = await db.query(
        `DELETE FROM usuario WHERE id_usuario=$1 RETURNING *`,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error('Usuário não encontrado');
    }
};

exports.getUserWithAvatar = async (id) => {
    const result = await db.query(
        `SELECT u.*, a.aparencia_json
         FROM usuario u
         LEFT JOIN avatar a 
         ON u.id_usuario = a.id_usuario
         WHERE u.id_usuario = $1`,
        [id]
    );

    return result.rows[0];
};

exports.recusarSolicitacao = async (id_usuario_1, id_usuario_2) => {
    const result = await db.query(
        `
        UPDATE amizade
        SET status = 'Recusado'
        WHERE id_usuario_1 = $1
        AND id_usuario_2 = $2
        AND status = 'Pendente'
        RETURNING *;
        `,
        [id_usuario_1, id_usuario_2]
    );

    if (result.rowCount === 0) {
        throw new Error('Solicitação não encontrada');
    }

    return result.rows[0];
};

exports.searchByUserName = async (userName) => {
  const result = await db.query(
    `
    SELECT id_usuario, nome_usuario, email
    FROM usuario
    WHERE nome_usuario ILIKE $1
    LIMIT 10
    `,
    [`%${userName}%`]
  );

  return result.rows;
};

exports.changePassword = async (id, senhaAtual, novaSenha) => {
  const userResult = await db.query(
    'SELECT * FROM usuario WHERE id_usuario = $1',
    [id]
  );

  const user = userResult.rows[0];

  if (!user) {
    throw new Error('User not found');
  }

  const senhaOk = await bcrypt.compare(senhaAtual, user.senha);

  if (!senhaOk) {
    throw new Error('Senha atual incorreta');
  }

  const hash = await bcrypt.hash(novaSenha, 10);

  await db.query(
    'UPDATE usuario SET senha = $1 WHERE id_usuario = $2',
    [hash, id]
  );

  return { message: 'Senha alterada com sucesso' };
};