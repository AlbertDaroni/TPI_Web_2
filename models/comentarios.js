const db = require('../config/db');

async function obtener(id) {
    try {
        const {rows} = await db.query('SELECT * FROM comentarios WHERE id = $1', [id]);
        return { comentario: rows[0] };
    } catch (error) { console.log('Error al obtener el comentario:', error); }
}

async function obtenerUsuarioDeComentario(id) {
    try {
        const {rows} = await db.query('SELECT id, nombre, foto_perfil FROM usuarios WHERE id = (SELECT id_usuario FROM comentarios WHERE id = $1)', [id]);
        return rows[0];
    } catch (error) { console.error('Error al obtener los comentarios', error); }
}

async function obtenerComentariosDeUnaPublicacion(id) {
    try {
        const {rows} = await db.query('SELECT * FROM comentarios WHERE id_publicacion = $1', [id]);
        const comentariosCompletos = await Promise.all(rows.map(async (comentario) => {
            const usuario = await obtenerUsuarioDeComentario(comentario.id);
            return { ...comentario, usuario: usuario };
        }));
        return { comentarios: comentariosCompletos, cantidad: rows.length };
    } catch (error) { console.error('Error al obtener los comentarios', error); }
}

async function crear(comentario) {
    try {
        const {rows} = await db.query(`
            INSERT INTO comentarios(comentario, fecha, denuncias, id_publicacion, id_usuario)
            VALUES($1, NOW(), 0, $2, $3)`, [comentario.comentario, comentario.id_publicacion, comentario.id_usuario]
        );
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al crear el comentario:', error); }
}

async function modificar(comentario) {
    try {
        const {rows} = await db.query(`
            UPDATE comentarios SET comentario = $1, denuncias = $2 WHERE id = $3`, 
            [comentario.comentario, comentario.denuncias, comentario.id]
        );
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al modificar el comentario:', error); }
}

async function eliminar(id) {
    try {
        const {rows} = await db.query('DELETE FROM comentarios WHERE id = $1', [id]);
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al eliminar el comentario:', error); }
}

async function eliminarTodosDeUnaPublicacion(id) {
    try {
        const {rows} = await db.query('DELETE FROM comentarios WHERE id_publicacion = $1', [id]);
        if (rows.affectedRows > 0) { return true; } else { return false; }
    } catch (error) { console.log('Error al eliminar los comentarios:', error); }
}

module.exports = {
    obtener,
    obtenerUsuarioDeComentario,
    obtenerComentariosDeUnaPublicacion,
    crear,
    modificar,
    eliminar,
    eliminarTodosDeUnaPublicacion
};