const db = require('../config/db');

async function obtenerPorID(id) {
    try {
        const {rows} = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        return rows[0];
    } catch (error) { console.log('Error al obtener el usuario por ID:', error); }
}

async function obtenerPorNombre(nombre) {
    try {
        const {rows} = await db.query('SELECT * FROM usuarios WHERE nombre LIKE %$1%', [nombre]);
        return rows[0];
    } catch (error) { console.log('Error al obtener el usuario por nombre:', error); }
}

async function obtenerPorCredenciales(usuario) {
    try {
        const {rows} = await db.query(`
            SELECT id, nombre, email, contraseña FROM usuarios WHERE nombre ILIKE $1 AND email = $2 AND contraseña = $3`,
            [usuario.nombre, usuario.email, usuario.contraseña]
        );
        return rows;
    } catch (error) { console.log('Error al obtener el usuario por sus credenciales:', error); }
}

async function crear(usuario) {
    try {
        const {rows} = await db.query(`
            INSERT INTO usuarios (nombre, foto_perfil, email, contraseña, fecha_creacion, descripcion)
            VALUES ($1, null, $2, $3, NOW(), null)`, [usuario.nombre, usuario.email, usuario.contraseña]
        );
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al crear el usuario:', error); }
}

async function modificar(usuario) {
    try {
        const {rows} = await db.query(`UPDATE usuarios SET foto_perfil = $1, nombre = $2, email = $3, contraseña = $4, descripcion = $5 WHERE id = $6`,
            [usuario.foto_perfil, usuario.nombre, usuario.email, usuario.contraseña, usuario.descripcion, usuario.id]
        );
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al modificar el usuario:', error); }
}

async function obtenerSeguidos(id) {
    try {
        const {rows} = await db.query(`
            SELECT u.id, u.nombre, u.foto_perfil 
            FROM usuarios u
            JOIN seguidores s ON u.id = s.id_seguido
            WHERE s.id_seguidor = $1`, [id]
        );
        return { seguidos: rows };
    } catch (error) { console.log('Error al obtener los seguidos:', error); }
}

async function obtenerSeguidores(id) {
    try {
        const {rows} = await db.query(`
            SELECT u.id, u.nombre, u.foto_perfil 
            FROM usuarios u
            JOIN seguidores s ON u.id = s.id_seguidor
            WHERE s.id_seguido = $1`, [id]
        );
        return { seguidores: rows };
    } catch (error) { console.log('Error al obtener los seguidores:', error); }
}

async function obtenerCantidadSeguidos(id) {
    try {
        const {rows} = await db.query('SELECT COUNT(*) AS Total FROM seguidores WHERE id_seguidor = $1', [id]);
        return { seguidos_Cantidad: rows[0].Total };
    } catch (error) { console.log('Error al obtener la cantidad de seguidos:', error); }
}

async function obtenerCantidadSeguidores(id) {
    try {
        const {rows} = await db.query('SELECT COUNT(*) AS Total FROM seguidores WHERE id_seguido = $1', [id]);
        return { seguidores_Cantidad: rows[0].Total };
    } catch (error) { console.log('Error al obtener la cantidad de seguidores:', error); }
}

async function seguir(id1, id2) {
    try {
        const {rows} = await db.query('INSERT INTO seguidores(id_seguidor, id_seguido) VALUES($1, $2)', [id1, id2]);
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al seguir al usuario:', error); }
}

async function dejarDeSeguir(id1, id2) {
    try {
        const {rows} = await db.query('DELETE FROM seguidores WHERE id_seguidor = $1 AND id_seguido = $2', [id1, id2]);
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al dejar de seguir al usuario:', error); }
}

async function loSigo(id1, id2) {
    try {
        const {rows} = await db.query('SELECT * FROM seguidores WHERE id_seguidor = $1 AND id_seguido = $2', [id1, id2]);
        if (rows.length === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al averiguar seguimiento:', error); }
}

async function borrar(id) {
    try {
        const {rows} = await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
        if (rows.length === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al borrar el usuario:', error); }
}

module.exports = {
    obtenerPorID,
    obtenerPorNombre,
    obtenerPorCredenciales,
    crear,
    modificar,
    obtenerSeguidos,
    obtenerSeguidores,
    obtenerCantidadSeguidos,
    obtenerCantidadSeguidores,
    seguir,
    dejarDeSeguir,
    loSigo,
    borrar
};