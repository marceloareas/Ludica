const db = require('../db/db.js');
const { httpError } = require('../middleware/http');

exports.listarItens = async (idUsuario) => {
    const saldo = await db.query('SELECT moedas FROM usuario WHERE id_usuario = $1', [idUsuario]);

    if (saldo.rows.length === 0) {
        throw httpError(404, 'Usuário não encontrado');
    }

    const itens = await db.query(
        `SELECT ia.id_item, ia.campo, ia.valor, ia.nome, ia.preco,
                (ui.id_usuario IS NOT NULL) AS possui
         FROM item_avatar ia
         LEFT JOIN usuario_item ui
                ON ui.id_item = ia.id_item AND ui.id_usuario = $1
         ORDER BY ia.campo, ia.preco, ia.nome`,
        [idUsuario]
    );

    return { moedas: saldo.rows[0].moedas, itens: itens.rows };
};

exports.carteira = async (idUsuario) => {
    const saldo = await db.query('SELECT moedas FROM usuario WHERE id_usuario = $1', [idUsuario]);

    if (saldo.rows.length === 0) {
        throw httpError(404, 'Usuário não encontrado');
    }

    const extrato = await db.query(
        `SELECT valor, motivo, id_referencia, data_transacao
         FROM transacao_moeda
         WHERE id_usuario = $1
         ORDER BY data_transacao DESC, id_transacao DESC
         LIMIT 20`,
        [idUsuario]
    );

    return { moedas: saldo.rows[0].moedas, extrato: extrato.rows };
};

exports.comprar = async (idUsuario, idItem) => {
    // Verificações só para devolver mensagens claras
    const itemRes = await db.query(
        'SELECT id_item, campo, valor, nome, preco FROM item_avatar WHERE id_item = $1',
        [idItem]
    );
    const item = itemRes.rows[0];

    if (!item) {
        throw httpError(404, 'Item não encontrado');
    }

    const posse = await db.query(
        'SELECT 1 FROM usuario_item WHERE id_usuario = $1 AND id_item = $2',
        [idUsuario, idItem]
    );

    if (posse.rowCount > 0) {
        throw httpError(409, 'Você já possui este item');
    }

    const saldoRes = await db.query('SELECT moedas FROM usuario WHERE id_usuario = $1', [idUsuario]);

    if (saldoRes.rows.length === 0) {
        throw httpError(404, 'Usuário não encontrado');
    }

    const saldo = saldoRes.rows[0].moedas;

    if (saldo < item.preco) {
        throw httpError(400, `Moedas insuficientes: você tem ${saldo} e o item custa ${item.preco}`);
    }

    // A garantia real é este comando único: débito, posse e extrato ocorrem juntos ou nenhum
    try {
        const result = await db.query(
            `WITH item AS (
                SELECT id_item, preco FROM item_avatar WHERE id_item = $2::int
             ),
             debito AS (
                UPDATE usuario u
                SET moedas = u.moedas - item.preco
                FROM item
                WHERE u.id_usuario = $1::int
                  AND u.moedas >= item.preco
                  AND NOT EXISTS (
                      SELECT 1 FROM usuario_item ui
                      WHERE ui.id_usuario = u.id_usuario AND ui.id_item = item.id_item
                  )
                RETURNING u.id_usuario, u.moedas, item.id_item, item.preco
             ),
             posse AS (
                INSERT INTO usuario_item (id_usuario, id_item)
                SELECT id_usuario, id_item FROM debito
             ),
             extrato AS (
                INSERT INTO transacao_moeda (id_usuario, valor, motivo, id_referencia)
                SELECT id_usuario, -preco, 'compra', id_item FROM debito
             )
             SELECT moedas FROM debito`,
            [idUsuario, idItem]
        );

        if (result.rowCount === 0) {
            throw httpError(409, 'Não foi possível concluir a compra. Tente novamente');
        }

        return { moedas: result.rows[0].moedas, item };
    } catch (err) {
        if (err.code === '23505') {
            throw httpError(409, 'Você já possui este item');
        }
        throw err;
    }
};

// Itens do catálogo que a configuração usa, mas o usuário ainda não comprou
exports.itensBloqueadosEmUso = async (idUsuario, config) => {
    const result = await db.query(
        `SELECT ia.campo, ia.valor, ia.nome
         FROM item_avatar ia
         WHERE NOT EXISTS (
             SELECT 1 FROM usuario_item ui
             WHERE ui.id_usuario = $1 AND ui.id_item = ia.id_item
         )`,
        [idUsuario]
    );

    return result.rows.filter((i) => config[i.campo] === i.valor);
};

// Crédito (valor > 0) ou débito (valor < 0), sempre com registro no extrato
exports.ajustarSaldo = async (idUsuario, valor, motivo) => {
    const delta = Number(valor);

    if (!Number.isInteger(delta) || delta === 0) {
        throw httpError(400, 'valor deve ser um inteiro diferente de zero');
    }

    const result = await db.query(
        `WITH upd AS (
            UPDATE usuario SET moedas = moedas + $2::int
            WHERE id_usuario = $1::int AND moedas + $2::int >= 0
            RETURNING id_usuario, moedas
         ),
         extrato AS (
            INSERT INTO transacao_moeda (id_usuario, valor, motivo, id_referencia)
            SELECT id_usuario, $2::int, $3::text, NULL::int FROM upd
         )
         SELECT moedas FROM upd`,
        [idUsuario, delta, motivo]
    );

    if (result.rowCount === 0) {
        const existe = await db.query('SELECT 1 FROM usuario WHERE id_usuario = $1', [idUsuario]);

        if (existe.rowCount === 0) {
            throw httpError(404, 'Usuário não encontrado');
        }

        throw httpError(400, 'Saldo insuficiente para este débito');
    }

    return { moedas: result.rows[0].moedas };
};