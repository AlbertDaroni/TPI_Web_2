const db = require('../config/db');
const { json } = require('express');

async function obtener(id) {
    try {
        const {rows} = await db.query(`
            SELECT n.*, u.nombre, u.foto_perfil, p.titulo
            FROM notificaciones n
            JOIN usuarios u ON n.id_causante = u.id
            LEFT JOIN publicaciones p ON n.id_publicacion = p.id
            WHERE id_dueño = $1
            ORDER BY fecha DESC`, [id]
        );

        return { notificaciones: rows};
    } catch (error) { console.log('Error al obtener las notificaciones:', error); }
}

async function crear(notificacion) {
    try {
        const {rows} = await db.query(`
            INSERT INTO notificaciones(tipo_evento, motivo, fecha, vista, id_causante, id_dueño, id_publicacion)
            VALUES ($1, $2, NOW(), 0, $3, $4, $5)`,
            [notificacion.tipo_evento, notificacion.motivo, notificacion.id_causante || null, notificacion.id_dueño || null, notificacion.id_publicacion || null]
        );
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch(error) { console.log('Error al crear la notificación:', error); }
}

async function eliminar(id) {
    try {
        const {rows} = await db.query('DELETE FROM notificaciones WHERE id_dueño = $1', [id]);
        if (rows.affectedRows > 0) { return true; } else { return false; }
    } catch(error) { console.log('Error al eliminar la notificación:', error); }
}

async function actualizarVisto(id) {
    try {
        const {rows} = await db.query('SELECT vista FROM notificaciones WHERE id = $1', [id]);
        if (rows.vista === 0) await db.query('UPDATE notificaciones SET vista = 1 WHERE id = $1', [id]);
        return json({ vista: rows[0].vista });
    } catch (error) { console.log('Error al actualizar el visto:', error); }
}

module.exports = {
    obtener,
    crear,
    eliminar,
    actualizarVisto
};