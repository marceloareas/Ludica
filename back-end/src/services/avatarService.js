const db = require('../db/db.js');

exports.createOrUpdateAvatar = async (userId, aparenciaJson) => {

    const avatarExiste = await db.query(
        `SELECT * FROM avatares WHERE id_usuario = $1`,
        [userId]
    );

    if (avatarExiste.rows.length > 0) {

        const result = await db.query(
            `UPDATE avatares
             SET aparencia_json = $1
             WHERE id_usuario = $2
             RETURNING *`,
            [aparenciaJson, userId]
        );

        return result.rows[0];
    }
    else {
        
        const result = await db.query(
            `INSERT INTO avatares
            (id_usuario, aparencia_json)
            VALUES ($1, $2)
            RETURNING *`,
            [userId, aparenciaJson]
        );
        
        return result.rows[0];
    }

};

exports.getAvatar = async (userId) => {

    const result = await db.query(
        `SELECT * FROM avatares
         WHERE id_usuario = $1`,
        [userId]
    );

    return result.rows[0];
};