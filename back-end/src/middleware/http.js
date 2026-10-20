function httpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

function parseId(valor, nome = 'id') {
    const n = Number(valor);
    if (!Number.isInteger(n) || n <= 0) {
        throw httpError(400, `${nome} inválido`);
    }
    return n;
}

// Envolve um handler async: devolve o resultado em JSON ou converte o erro em resposta HTTP
const handle = (fn, successStatus = 200) => async (req, res) => {
    try {
        const result = await fn(req);

        if (successStatus === 204) {
            return res.status(204).send();
        }

        return res.status(successStatus).json(result);
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }

        if (err.code === '23505') {
            return res.status(409).json({ error: 'Registro duplicado' });
        }

        console.error(err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

module.exports = { httpError, parseId, handle };