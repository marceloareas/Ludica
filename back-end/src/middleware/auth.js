const jwt = require('jsonwebtoken');

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

module.exports = { authenticate, onlyOwner, SECRET };