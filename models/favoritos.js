const db = require('../config/db');
const publicacion = require('./publicacion');

async function obtener(nombre, id) {
    try {
        const {rows} = await db.query('SELECT * FROM favoritos WHERE nombre ILIKE %$1% AND id_usuario = $2', [nombre, id]);

        const ids = rows.map(favorita => favorita.id_publicacion);
        if (ids.length === 0) return [];

        let publicaciones = [];
        
        for (const id of ids) { publicaciones.push(await publicacion.obtenerPorID(id)); }
        return { favoritos: publicaciones };
    } catch (error) { console.log('Error al obtener los favoritos:', error); }
}

async function crear(favorito) {
    try {
        const {rows} = await db.query(`
            INSERT INTO favoritos(nombre, id_publicacion, id_usuario)
            VALUES($1, $2, $3)`, [favorito.nombre, favorito.id_publicacion, favorito.id_usuario]
        );
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al crear el favorito:', error); }
}

async function eliminar(id) {
    try {
        const {rows} = await db.query('DELETE FROM favoritos WHERE id_publicacion = $1', [id]);
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al eliminar el favorito:', error); }
}

async function eliminarLista(nombre) {
    try {
        const {rows} = await db.query('DELETE FROM favoritos WHERE nombre = $1', [nombre]);
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al eliminar la lista de favoritos:', error); }
}

module.exports = {
    obtener,
    crear,
    eliminar,
    eliminarLista
};