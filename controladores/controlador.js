const db = require('../config/db');

/* CONTENIDO DE LA PÁGINA PRINCIPAL --------------------------------------------------------------------------------------- */
async function contenidoPaginaPrincipal(req, res, next) {
    try {
        const publicaciones = await obtenerDatosGeneralesPublicacion("todas", null, null, null);
        const [filas] = (await db.query('SELECT * FROM usuarios WHERE id = ?', [req.session.userId]));
        res.render('index', { datos: publicaciones, usuario: filas[0] });
    } catch (error) { next(error); }
}

/* ACTUALIZAR LIKES ------------------------------------------------------------------------------------------------------- */
async function actualizarLikes(req, res, next) {
    try {
        const [publicacionesPropias] = await db.query('SELECT id FROM publicaciones WHERE id_usuario = ?', [req.session.userId]);

        if (publicacionesPropias.length === 0) {
            await db.query('UPDATE publicaciones SET likes = likes + 1 WHERE id = ?', [req.params.id]);
            const [filas] = await db.query('SELECT * FROM publicaciones WHERE id = ?', [req.params.id]);
            res.json({ likes: filas[0].likes });
        }
    } catch (error) { next(error); }
}

/* DATOS GENERALES DE LAS PUBLICACIONES */
async function obtenerDatosGeneralesPublicacion(tipo, nombre, id_usuario, id_publicacion) {
    let publicaciones;
    switch (tipo) {
        case "todas": publicaciones = await obtenerPublicaciones(); break;
        case "usuario": publicaciones = await obtenerPublicacionesDeUnUsuario(id_usuario); break;
        case "favoritas": publicaciones = await obtenerPublicacionesFavoritas(nombre, id_usuario, id_publicacion); break;
        case "masRelevantes": publicaciones = await obtenerPublicacionesMasRelevantes(); break;
        case "menosRelevantes": publicaciones = await obtenerPublicacionesMenosRelevantes(); break;
        default: return;
    }

    const datos = await Promise.all(publicaciones.map(async (publicacion) => {
        const [imagenes, usuario, infoComentarios, etiquetas, denuncias] = await Promise.all([
            obtenerImagenes(publicacion.id),
            obtenerUsuario(publicacion.id),
            obtenerComentarios(publicacion.id),
            obtenerEtiquetas(publicacion.id),
            obtenerDenuncias(publicacion.id)
        ]);

        return {
            publicacion, imagenes, usuario,
            comentarios: infoComentarios.comentarios, cantidad: infoComentarios.cantidad, 
            etiquetas, denuncias
        };
    }));
    
    return datos;

    async function obtenerPublicaciones() {
        try {
            const [publicaciones] = await db.query('SELECT * FROM publicaciones ORDER BY RAND() LIMIT 10');
            return publicaciones;
        } catch(error) { console.error('Error al obtener las publicaciones', error); }
    }
    async function obtenerPublicacionesMasRelevantes() {
        try {
            const [publicaciones] = await db.query('SELECT * FROM publicaciones ORDER BY likes, RAND() DESC LIMIT 10');
            return publicaciones;
        } catch (error) { console.error('Error al obtener las publicaciones mejor valorizadas', error) }
    }
    async function obtenerPublicacionesMenosRelevantes() {
        try {
            const [publicaciones] = await db.query('SELECT * FROM publicaciones ORDER BY likes, RAND() ASC LIMIT 10');
            return publicaciones;
        } catch (error) { console.error('Error al obtener las publicaciones peor valorizadas', error) }
    }
    async function obtenerPublicacionesDeUnUsuario(id_usuario) {
        try {
            const [publicaciones] = await db.query('SELECT * FROM publicaciones WHERE id_usuario = ?', [id_usuario]);
            return publicaciones;
        } catch (error) { console.error('Error al obtener las publicaciones de un usuario', error) }
    }
    async function obtenerPublicacionesFavoritas(nombre, id_usuario, id_publicacion) {
        try {
            const [publicaciones] = await db.query('SELECT * FROM favoritos WHERE nombre = ? AND id_usuario = ? AND id_publicacion = ?',
                [nombre, id_usuario, id_publicacion]);
            return publicaciones;
        } catch (error) { console.error('Error al obtener las publicaciones favoritas', error) }
    }
    async function obtenerImagenes(id_publicacion) {
        try {
            const [imagenes] = await db.query('SELECT * FROM imagenes WHERE id_publicacion = ?', [id_publicacion]);
            return imagenes;
        } catch (error) { console.error('Error al obtener las imágenes:', error); }
    }
    async function obtenerUsuario(id_publicacion) {
        try {
            const [usuario] = await db.query('SELECT id, nombre, foto_perfil FROM usuarios WHERE id = (SELECT id_usuario FROM publicaciones WHERE id = ?)', [id_publicacion]);
            return usuario[0];
        } catch (error) { console.error('Error al obtener el usuario', error); }
    }
    async function obtenerUsuarioDeComentario(id_comentario) {
        try {
            const [usuarios] = await db.query('SELECT id, nombre, foto_perfil FROM usuarios WHERE id = (SELECT id_usuario FROM comentarios WHERE id = ?)', [id_comentario]);
            return usuarios[0];
        } catch (error) { console.error('Error al obtener los comentarios', error); }
    }
    async function obtenerComentarios(id_publicacion) {
        try {
            const [comentarios] = await db.query('SELECT * FROM comentarios WHERE id_publicacion = ?', [id_publicacion]);
            const comentariosCompletos = await Promise.all(comentarios.map(async (comentario) => {
                const usuario = await obtenerUsuarioDeComentario(comentario.id);
                return { ...comentario, usuario: usuario };
            }));
            return { comentarios: comentariosCompletos, cantidad: comentarios.length };
        } catch (error) { console.error('Error al obtener los comentarios', error); }
    }
    async function obtenerEtiquetas(id_publicacion) {
        try {
            const [etiquetas] = await db.query('SELECT * FROM etiquetas WHERE id_publicacion = ?', [id_publicacion]);
            return etiquetas;
        } catch (error) { console.error('Error al obtener las etiquetas', error); }
    }
    async function obtenerDenuncias(id_publicacion) {
        try {
            const [denuncias] = await db.query('SELECT * FROM denuncias WHERE id_publicacion = ?', [id_publicacion]);
            return denuncias;
        } catch (error) { console.error('Error al obtener las denuncias', error); }
    }
}

module.exports = {
    contenidoPaginaPrincipal,
    actualizarLikes,
    obtenerDatosGeneralesPublicacion
};