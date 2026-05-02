const db = require('../config/db');
const publicacion = require('./publicacion');

async function actualizarLikes(id1, id2) {
    try {
        const {rows} = await db.query('SELECT id FROM likes WHERE id_publicacion = $1 AND id_usuario = $2', [id2, id1]);

        if (rows.length > 0) {
            await db.query('UPDATE publicaciones SET likes = likes - 1 WHERE id = $1', [id2]);
            await db.query('DELETE FROM likes WHERE id_publicacion = $1 AND id_usuario = $2', [id2, id1]);
        } else {
            await db.query('UPDATE publicaciones SET likes = likes + 1 WHERE id = $1', [id2]);
            await db.query('INSERT INTO likes(id_usuario, id_publicacion) VALUES($1, $2)', [id1, id2]);
        }

        const likesActualizados = publicacion.obtener(id);
        return json({ likes: likesActualizados[0].likes });
    } catch (error) { console.log('Error al actualizar los likes:' ,error); }
}

module.exports = { actualizarLikes };