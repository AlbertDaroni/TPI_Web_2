const db = require('../config/db');
const imagen = require('./imagen');
const comentario = require('./comentarios');
const etiqueta = require('./etiqueta');
const denuncia = require('./denuncia');

async function crear(publicacion, id) {
    try {
        const {rows} = await db.query(`
            INSERT INTO publicaciones (titulo, descripcion, likes, fecha, denuncias, id_usuario)
            VALUES ($1, $2, 0, NOW(), 0, $3)`, [publicacion.titulo, publicacion.descripcion, id]
        );
        if (rows.affectedRows === 1) { return true; } else { return false; }
    } catch (error) { console.log('Error al crear la publicación:', error); }
}

async function eliminar(id) {
    try {
        let resultado = false;
        resultado = await imagen.eliminar(id);
        resultado = await comentario.eliminarTodosDeUnaPublicacion(id);
        resultado = await etiqueta.eliminarTodasDeUnaPublicacion(id);
        const {rows} = await db.query('DELETE FROM publicaciones WHERE id = $1', [id]);
        if (rows.affectedRows === 1) { resultado = true; }

        if (resultado === true) { return true; } else { return false; }
    } catch (error) { console.log('Error al eliminar la publicación:', error); }
}

async function obtenerPorID(id) {
    try {
        const {rows} = await db.query('SELECT * FROM publicaciones WHERE id = $1', [id]);
        const publicacion = await obtenerDatosCompletos(rows);
        return { publicacion: publicacion[0] };
    } catch (error) { console.log('Error al obtener la publicación:', error); }
}

async function obtenerPorTitulo(titulo) {
    try {
        const {rows} = await db.query('SELECT * FROM publicaciones WHERE titulo LIKE %$1%', [titulo]);
        const publicacion = await obtenerDatosCompletos(rows);
        return { publicacion: publicacion[0] };
    } catch (error) { console.log('Error al obtener la publicación:', error); }
}

async function obtener10Publicaciones() {
    try {
        const {rows} = await db.query('SELECT * FROM publicaciones ORDER BY random() LIMIT 10');
        const publicaciones = await obtenerDatosCompletos(rows);
        return publicaciones;
    } catch(error) { console.error('Error al obtener las publicaciones', error); }
}

async function obtenerPublicacionesDeUnUsuario(id) {
    try {
        const {rows} = await db.query('SELECT * FROM publicaciones WHERE id_usuario = $1', [id]);
        const publicaciones = await obtenerDatosCompletos(rows);
        return publicaciones;
    } catch (error) { console.error('Error al obtener las publicaciones de un usuario:', error) }
}

async function obtenerPublicacionesDeVariosUsuarios(ids) {
    try {
        const {rows} = await db.query('SELECT * FROM publicaciones WHERE id_usuario IN ($1)', [ids]);
        const publicaciones = await obtenerDatosCompletos(rows);
        return publicaciones;
    } catch (error) { console.error('Error al obtener las publicaciones de los usuarios:', error) }
}

async function obtenerDatosCompletos(publicaciones) {
    const datos = await Promise.all(publicaciones.map(async (publicacion) => {
        const [imagenes, usuario, infoComentarios, likes, etiquetas, denuncias] = await Promise.all([
            imagen.obtenerTodasDeUnaPublicacion(publicacion.id),
            obtenerUsuarioDeLaPublicacion(publicacion.id),
            comentario.obtenerComentariosDeUnaPublicacion(publicacion.id),
            obtenerLikes(publicacion.id),
            etiqueta.obtenerEtiquetas(publicacion.id),
            denuncia.obtenerTodasDeUnaPublicacion(publicacion.id)
        ]);

        // const dioLike = likes.some(l => l.id_usuario = req.session.userId);

        return {
            publicacion, imagenes, usuario,
            comentarios: infoComentarios.comentarios, cantidad: infoComentarios.cantidad, 
            likes, /* dioLike, */ etiquetas, denuncias
        };
    }));
    
    return datos;

    async function obtenerUsuarioDeLaPublicacion(id) {
        try {
            const {rows} = await db.query('SELECT id, nombre, foto_perfil FROM usuarios WHERE id = (SELECT id_usuario FROM publicaciones WHERE id = $1)', [id]);
            return rows[0];
        } catch (error) { console.error('Error al obtener el usuario:', error); }
    }

    async function obtenerLikes(id) {
        try {
            const {rows} = await db.query('SELECT * FROM likes WHERE id_publicacion = $1', [id]);
            return rows;
        } catch (error) { console.error('Error al obtener los Likes:', error); }
    }
}

module.exports = {
    crear,
    eliminar,
    obtenerPorID,
    obtenerPorTitulo,
    obtener10Publicaciones,
    obtenerPublicacionesDeUnUsuario,
    obtenerPublicacionesDeVariosUsuarios
};