const Usuario = require('../models/Usuario');
const denuncia = require('../models/Denuncia');
const Publicacion = require('../models/Publicacion');
const Notificacion = require('../models/Notificacion');

async function contenidoPaginaPrincipal(req, res, next) {
    try {
        const esValido = await controlDeDenuncias(req, next);
        if (!esValido) { res.render('notificaciones'); }

        const publicaciones = await Publicacion.obtener10Publicaciones(req.session.userId);
        const filas = await Usuario.obtenerPorID(req.session.userId);
        
        res.render('index', { datos: publicaciones, usuario: { ...filas[0], id: req.session.userId } });
    } catch (error) { next(error); }
}

async function controlDeDenuncias(req, next) {
    try {
        const publicaciones = await Publicacion.obtenerPublicacionesDeUnUsuario(req.session.userId, req.session.userId);
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
                    await Notificacion.crear(nuevaNotificacion);
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
                    await Notificacion.crear(nuevaNotificacion);
                }
            }
        }

        return pasa;
    } catch (error) { next(error); }
}

async function controlDeContenido(req, res, next) {
    try {
        
    } catch (error) { next(error); }
}

module.exports = { contenidoPaginaPrincipal };