const db = require('../config/db');

/* CONTENIDO DE LA PÁGINA PRINCIPAL --------------------------------------------------------------------------------------- */
async function contenidoPaginaPrincipal(req, res, next) {
    try {
        const publicaciones = await obtenerPublicaciones();
        const datos = await Promise.all(publicaciones.map(async (publicacion) => {
            const [
                [imagenes],
                usuario,
                [comentarios],
                cantidad,
                [etiquetas],
                [denuncias]
            ] = await Promise.all([
                obtenerImagenes(publicacion.id),
                obtenerUsuario(publicacion.id),
                obtenerComentarios(publicacion.id).comentarios,
                obtenerComentarios(publicacion.id).cantidad,
                obtenerEtiquetas(publicacion.id),
                obtenerDenuncias(publicacion.id)
            ]);
            
            const comentariosCompletos = await Promise.all(comentarios.map(async (comentario) => {
                comentario.id_usuario = (await obtenerUsuarioDeComentario(comentario.id));
                return { comentario, usuario: comentario.id_usuario };
            }));

            return { publicacion, imagenes, usuario, comentarios: comentariosCompletos, cantidad, etiquetas, denuncias };
        }));

        const perfil = (await db.query('SELECT * FROM usuarios LIMIT 1'))[0]; // Esto debe cambiarse. El perfil debe venir en los parámetros

        res.render('index', { datos: datos, perfil: perfil });
    } catch (error) { next(error); }

    async function obtenerPublicaciones() {
        try {
            const [publicaciones] = await db.query('SELECT * FROM publicaciones LIMIT 10');
            return publicaciones;
        } catch (error) { console.error('Error al obtener las publicaciones:', error); }
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
            return { comentarios, cantidad: comentarios.length };
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

/* VER PUBLICACIÓN -------------------------------------------------------------------------------------------------------- */
async function verPublicacion(req, res, next) {
    try {
        const [rows] = await db.query('SELECT * FROM publicaciones WHERE id = ?', [req.params.id]);
        if (rows.length === 0) { return res.status(404).send('Publicación no encontrada'); }

        res.render('publicacion', { publicacion: rows[0] });
    } catch (error) { next(error); }
}

/* ACTUALIZAR LIKES ------------------------------------------------------------------------------------------------------- */
async function actualizarLikes(req, res, next) {
    try {
        await db.query('UPDATE publicaciones SET likes = likes + 1 WHERE id = ?', [req.params.id]);
        const [rows] = await db.query('SELECT * FROM publicaciones WHERE id = ?', [req.params.id]);
        res.json({ likes: rows[0].likes });
    } catch (error) { next(error); }
}

/* PERFIL ----------------------------------------------------------------------------------------------------------------- */
async function perfil(req, res, next) {
    try {
        const [usuario] = await db.query('SELECT * FROM usuarios WHERE id = ?', [req.params.id]);
        if (usuario.length === 0) { return res.status(404).send('No se pudo acceder al perfil'); }

        res.render('perfil', { usuarios: usuario[0] });
    } catch (error) { next(error); }
}

/* DENUNCIAR PUBLICACIÓN -------------------------------------------------------------------------------------------------- */
async function denunciarPublicacion(req, res, next) {
    try {
        const { descripcion, id_publicacion } = req.body;
        
        await db.query(`
            INSERT INTO denuncias (descripcion, fecha, id_publicacion, id_comentario)
            VALUES (?, NOW(), ?, null)`, [descripcion, id_publicacion]
        );

        await db.query('UPDATE publicaciones SET denuncias = denuncias + 1 WHERE id = ?', [id_publicacion]);
        
        res.redirect(`/publicacion/${id_publicacion}`);
    } catch (error) { next(error); }
}

/* DENUNCIAR COMENTARIO --------------------------------------------------------------------------------------------------- */
async function denunciarComentario(req, res, next) {
    try {
        const { descripcion, id_publicacion, id_comentario } = req.body;

        await db.query(`
            INSERT INTO denuncias (descripcion, fecha, id_publicacion, id_comentario)
            VALUES (?, NOW(), null, ?)`, [descripcion, id_comentario]
        );

        await db.query('UPDATE comentarios SET denuncias = denuncias + 1 WHERE id = ?', [id_comentario]);

        res.redirect(`/publicacion/${id_publicacion}`);
    } catch (error) { next(error); }
}

/* CREAR PUBLICACIÓN ------------------------------------------------------------------------------------------------------ */
async function crearPublicacion(req, res, next) {
    try {
        const { titulo, descripcion, imagen, licencia, id_usuario, usuarios } = req.body;

        const [result] = await db.query(`
            INSERT INTO publicaciones (titulo, descripcion, likes, fecha, denuncias, id_usuario)
            VALUES (?, ?, 0, NOW(), 0, ?)`, [titulo, descripcion, id_usuario]
        );

        const id_publicacion = result.insertId;
        await db.query(`INSERT INTO imagenes (imagen, licencia, id_publicacion)
        VALUES (?, ?, ?)`, [imagen, licencia, id_publicacion]);

        const [id_usuarios] = await db.query('SELECT id FROM usuarios WHERE id IN (?)', [usuarios]);

        for(const usuario of id_usuarios) {
            await db.query(`INSERT INTO etiquetas (id_publicacion, id_usuario)
            VALUES (?, ?)`, [id_publicacion, usuario.id]);
        }

        res.redirect('/');
    } catch (error) { next(error); }
}

/* ELIMINAR PUBLICACIÓN --------------------------------------------------------------------------------------------------- */
async function eliminarPublicacion(req, res, next) {
    try {
        await db.query('DELETE FROM imagenes WHERE id_publicacion = ?', [req.params.id]);
        await db.query('DELETE FROM comentarios WHERE id_publicacion = ?', [req.params.id]);
        await db.query('DELETE FROM etiquetas WHERE id_publicacion = ?', [req.params.id]);
        await db.query('DELETE FROM publicaciones WHERE id = ?', [req.params.id]);

        res.redirect(`/perfil/${req.body.id_usuario}`);
    } catch (error) { next(error); }
}

/* CREAR COMENTARIO ------------------------------------------------------------------------------------------------------- */
async function agregarComentario(req, res, next) {
    try {
        const { comentario, id_usuario } = req.body;
        const id_publicacion = req.params.id_publicacion;

        await db.query(`
            INSERT INTO comentarios (comentario, fecha, id_publicacion, id_usuario)
            VALUES (?, NOW(), ?, ?)`, [comentario, id_publicacion, id_usuario]);

        res.redirect(`/publicacion/${id_publicacion}`);
    } catch (error) { next(error); }
}

/* MODIFICAR COMENTARIO */
async function modificarComentario(req, res, next) {
    try {
        const comentario = req.body.comentario;
        await db.query('UPDATE comentarios SET comentario = ? WHERE id = ?', [comentario, req.params.id_comentario]);
        res.redirect(`/publicacion/${req.params.id_publicacion}`);
    } catch (error) { next(error); }
}

/* ELIMINAR COMENTARIO ---------------------------------------------------------------------------------------------------- */
async function eliminarComentario(req, res, next) {
    try {
        await db.query('DELETE FROM comentarios WHERE id = ?', [req.params.id_comentario]);
        res.redirect(`/publicacion/${req.params.id_publicacion}`);
    } catch (error) { next(error); }
}

module.exports = {
    contenidoPaginaPrincipal,
    verPublicacion,
    actualizarLikes,
    perfil,
    denunciarPublicacion,
    denunciarComentario,
    crearPublicacion,
    eliminarPublicacion,
    agregarComentario,
    modificarComentario,
    eliminarComentario
};