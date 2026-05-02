const db = require('../config/db');

async function obtener(id) {
    try {
        const {rows} = await db.query('SELECT * FROM etiquetas WHERE id = $1', [id]);
        return { etiqueta: rows[0] };
    } catch (error) { console.log('Error al obtener la etiqueta:', error); }
}

async function obtenerEtiquetas(id) {
    try {
        const {rows} = await db.query('SELECT * FROM etiquetas WHERE id_publicacion = $1', [id]);
        return rows;
    } catch (error) { console.error('Error al obtener las etiquetas', error); }
}

async function crear(etiqueta) {
    try {
        const {rows} = await db.query(`
            INSERT INTO etiquetas(titulo, id_publicacion)
            VALUES($1, $2)`, ['#' + etiqueta.titulo, etiqueta.id_publicacion]
        );
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al crear la etiqueta:', error); }
}

async function modificar(etiqueta) {
    try {
        const {rows} = await db.query('UPDATE etiquetas SET titulo = $1 WHERE id_publicacion = $2', [etiqueta.titulo, etiqueta.id_publicacion]);
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al modificar la etiqueta:', error); }
}

async function eliminar(id) {
    try {
        const {rows} = await db.query('DELETE FROM etiquetas WHERE id = $1', [id]);
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al eliminar la etiqueta:', error); }
}

async function eliminarTodasDeUnaPublicacion(id) {
    try {
        const {rows} = await db.query('DELETE FROM etiquetas WHERE id_publicacion = $1', [id]);
        if (rows.affectedRows > 0) { return true; } else { return false; }
    } catch (error) { console.log('Error al eliminar las etiquetas:', error); }
}

module.exports = {
    obtener,
    obtenerEtiquetas,
    crear,
    modificar,
    eliminar,
    eliminarTodasDeUnaPublicacion
};