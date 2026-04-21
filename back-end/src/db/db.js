const { Pool } = require('pg');

const pool = new Pool({
    user: 'usuario_admin',
    host: 'localhost',
    database: 'Ludica_desenv',
    password: 'Ludicaproject123',
    port: 5433,
});

module.exports = pool;
