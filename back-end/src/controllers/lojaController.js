const service = require('../services/lojaService');
const { handle, parseId } = require('../middleware/http');

// O usuário vem sempre do token, nunca da URL
exports.listarItens = handle((req) => service.listarItens(req.user.id));
exports.carteira = handle((req) => service.carteira(req.user.id));
exports.comprar = handle((req) =>
    service.comprar(req.user.id, parseId(req.params.idItem, 'item'))
);

// Somente administrador (a rota aplica requireAdmin)
exports.ajustarMoedas = handle((req) =>
    service.ajustarSaldo(parseId(req.params.id), req.body.valor, 'ajuste_admin')
);