const db = require('../db/db.js');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const SECRET = 'segredo_super_secreto';


exports.getAll = async () => {
    const result = await db.query('SELECT * FROM usuarios');
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
        `INSERT INTO usuarios 
        (email, nome_completo, nome_usuario, senha, data_nascimento, tipo_usuario, flag_usuario)
        VALUES ($1,$2,$3,$4,$5,'Jogador','A')
        RETURNING *`,
        [email, name, userName, hashedPassword, birthDate]
    );

    return result.rows[0];
};

exports.login = async (userName, password) => {
    const result = await db.query(
        `SELECT * FROM usuarios WHERE nome_usuario = $1`,
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
            email: user.email
        }
    };
};

exports.update = async (id, data) => {
    const result = await db.query(
        `UPDATE usuarios 
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
        `DELETE FROM usuarios WHERE id_usuario=$1 RETURNING *`,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error('Usuário não encontrado');
    }
};

exports.getUserWithAvatar = async (id) => {
    const result = await db.query(
        `SELECT u.*, a.aparencia_json
         FROM usuarios u
         LEFT JOIN avatares a 
         ON u.id_usuario = a.id_usuario
         WHERE u.id_usuario = $1`,
        [id]
    );

    return result.rows[0];
};