const db = require('../config/db');

async function obtener(id) {
    try {
        const {rows} = await db.query('SELECT * FROM imagenes WHERE id = $1', [id]);
        return { imagen: rows[0] };
    } catch (error) { console.log('Error al obtener la imagen:', error); }
}

async function obtenerTodasDeUnaPublicacion(id) {
    try {
        const {rows} = await db.query('SELECT * FROM imagenes WHERE id_publicacion = $1', [id]);
        return { imagenes: rows };
    } catch (error) { console.log('Error al obtener las imágenes:', error); }
}

async function crear(imagen) {
    try {
        const {rows} = await db.query(`
            INSERT INTO imagenes(imagen, licencia, id_publicacion)
            VALUES($1, 0, $2)`, [imagen.imagen, imagen.id_publicacion]
        );
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al crear la imagen:', error); }
}

async function eliminar(id) {
    try {
        const {rows} = await db.query('DELETE FROM imagenes WHERE id_publicacion = $1', [id]);
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al eliminar la imagen:', error); }
}

module.exports = {
    obtener,
    obtenerTodasDeUnaPublicacion,
    crear,
    eliminar
};