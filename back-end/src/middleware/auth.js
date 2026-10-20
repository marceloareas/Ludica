const jwt = require('jsonwebtoken');
const db = require('../db/db');

const SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

// ... authenticate e onlyOwner continuam iguais ...

async function requireAdmin(req, res, next) {
    try {
        const result = await db.query(
            'SELECT tipo_usuario FROM usuario WHERE id_usuario = $1',
            [req.user.id]
        );

        if (result.rows[0]?.tipo_usuario !== 'Administrador') {
            return res.status(403).json({ error: 'Acesso restrito a administradores' });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = { authenticate, onlyOwner, requireAdmin, SECRET };