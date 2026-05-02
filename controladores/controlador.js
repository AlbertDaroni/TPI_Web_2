const usuario = require('../models/usuario');
const denuncia = require('../models/denuncia');
const publicacion = require('../models/publicacion');
const notificacion = require('../models/notificaciones');

async function contenidoPaginaPrincipal(req, res, next) {
    try {
        if (!control(req, next)) { res.render('notificaciones'); }
        const publicaciones = await publicacion.obtener10Publicaciones();
        const filas = await usuario.obtenerPorID(req.session.userId);
        res.render('index', { datos: publicaciones, usuario: filas[0] });
    } catch (error) { next(error); }
}

async function control(req, next) {
    try {
        const publicaciones = await publicacion.obtenerPublicacionesDeUnUsuario(req.session.userId);
        let pasa = true;

        for (let i = 0; i < publicaciones.length; i++) {
            if (publicaciones[i].publicacion.denuncias >= 3) {
                const motivos = await denuncia.obtenerTodasDeUnaPublicacion(publicaciones[i].publicacion.id);
                pasa = false;
                for (const motivo of motivos) {
                    const nuevaNotificacion = {
                        "tipo_evento": "Denuncia", 
                        "motivo": motivo.descripcion,
                        "id_dueño": publicaciones[i].publicacion.id_usuario,
                        "id_publicacion": publicaciones[i].publicacion.id
                    }
                    await notificacion.crear(nuevaNotificacion);
                }
            }

            if (publicaciones[i].comentarios.denuncias >= 3) {
                const motivos = await denuncia.obtenerTodasDeUnComentario(publicaciones[i].comentarios.comentario.id);
                pasa = false;
                for (const motivo of motivos) {
                    const nuevaNotificacion = {
                        "tipo_evento": "Denuncia", 
                        "motivo": motivo.descripcion,
                        "id_dueño": publicaciones[i].publicacion.id_usuario,
                        "id_publicacion": publicaciones[i].publicacion.id
                    }
                    await notificacion.crear(nuevaNotificacion);
                }
            }
        }

        return pasa;
    } catch (error) { next(error); }
}

module.exports = { contenidoPaginaPrincipal };