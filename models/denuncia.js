const db = require('../config/db');

async function obtener(id) {
    try {
        const {rows} = await db.query('SELECT * FROM denuncias WHERE id = $1', [id]);
        return { denuncia: rows[0] };
    } catch (error) { console.log('Error al obtener la denuncia:', error); }
}

async function obtenerTodasDeUnaPublicacion(id) {
    try {
        const {rows} = await db.query('SELECT * FROM denuncias WHERE id_publicacion = $1', [id]);
        return { denuncias: rows };
    } catch (error) { console.log('Error al obtener las denuncias de la publicación:', error); }
}

async function obtenerTodasDeUnComentario(id) {
    try {
        const {rows} = await db.query('SELECT * FROM denuncias WHERE id_comentario = $1', [id]);
        return { denuncias: rows };
    } catch (error) { console.log('Error al obtener las denuncias del comentario:', error); }
}

async function crear(denuncia) {
    const {rows} = await db.query(`
        INSERT INTO denuncias (descripcion, fecha, id_publicacion, id_comentario)
        VALUES ($1, NOW(), $2, null)`, [denuncia.descripcion, denuncia.id_publicacion]
    );
    if (rows.affectedRows === 1) { return true; } else { return false; }
}

async function eliminar(id) {
    const {rows} = await db.query('DELETE FROM denuncias WHERE id = $1', [id]);
    if (rows.affectedRows === 1) { return true; } else { return false; }
}

module.exports = {
    obtener,
    obtenerTodasDeUnaPublicacion,
    obtenerTodasDeUnComentario,
    crear,
    eliminar
};