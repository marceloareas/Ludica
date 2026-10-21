const jwt = require('jsonwebtoken');
const db = require('../db/db');

const SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

function authenticate(req, res, next) {
    const [scheme, token] = (req.headers.authorization || '').split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Token não informado' });
    }

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        return res.status(401).json({ error: 'Sessão expirada. Faça login novamente' });
    }
}

// O usuário autenticado só pode alterar os próprios dados
function onlyOwner(req, res, next) {
    if (String(req.user.id) !== String(req.params.id)) {
        return res.status(403).json({ error: 'Você só pode alterar os próprios dados' });
    }
    next();
}

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