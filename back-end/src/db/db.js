const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'usuario_admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'Ludica_desenv',
    password: process.env.DB_PASSWORD || 'Ludicaproject123',
    port: Number(process.env.DB_PORT) || 5433,
});

module.exports = pool;
