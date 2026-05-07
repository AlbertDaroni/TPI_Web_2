const Usuario = require('../models/Usuario');
const favoritos = require('../models/Favorito');
const Publicacion = require('../models/Publicacion');
const notificacion = require('../models/Notificacion');

async function registrar(req, res, next) {
    try {
        const { nombre, email, contraseña } = req.body;

        if (nombre.trim() === '' || email.trim() === '' || contraseña.trim() === '') { res.render('registro', { error: 'Todos los campos son obligatorios' }); }

        const nuevoUsuario = await Usuario.crear({ "nombre": nombre, "email": email, "contraseña": contraseña });
        req.session.userId = nuevoUsuario.id;

        res.redirect('/');
    } catch (error) {
        if (error.errno === 23505) return res.render('registro', { error: 'Nombre en uso' });
        next(error);
    }
}

async function ingresar(req, res, next) {
    try {
        const { nombre, email, contraseña } = req.body;

        if (nombre.trim() === '' || email.trim() === '' || contraseña.trim() === '') { res.render('ingreso', { error: 'Todos los campos son obligatorios' }); }

        const nuevoUsuario = await Usuario.obtenerPorCredenciales({ "nombre": nombre, "email": email, "contraseña": contraseña });
        
        if (nuevoUsuario && nuevoUsuario.length > 0) {
            req.session.userId = nuevoUsuario[0].id;
            res.redirect('/');
        } else { res.render('ingreso', { error: 'Credenciales inválidas'}); }
    } catch (error) { next(error); }
}

async function modificar(req, res, next) {
    try {
        const id = req.session.userId;
        if (req.method === 'GET') {
            res.render('modificar', { usuario: await Usuario.obtenerPorID(id) });
        } else {
            const { nombre, email, contraseña, descripcion } = req.body;
            const usuarioActual = await Usuario.obtenerPorID(id);
            const foto_perfil = req.file ? `/uploads/${req.file.filename}` : usuarioActual.foto_perfil;

            if (nombre.trim() === '' || email.trim() === '' || contraseña.trim() === '') { res.render('modificar', { error: 'Todos los campos son obligatorios' }); }

            await Usuario.modificar({ "foto_perfil": foto_perfil, "nombre": nombre, "email": email, "contraseña": contraseña, "descripcion": descripcion, "id": id });
            res.redirect(`/usuario/${id}/perfil`);
        }
    } catch (error) {
        if (error.errno === 23505) return res.render('modificar', { error: 'Nombre en uso' });
        next(error);
    }
}

async function perfil(req, res, next) {
    try {
        const id_perfil = req.params.id;
        const id_registrado = req.session.userId;
        const esMiPerfil = Number(id_perfil) === Number(id_registrado);

        if (isNaN(Number(id_perfil))) { return res.status(400).json({ error: 'Dato inválido' }); }

        const filas = await Usuario.obtenerPorID(id_perfil);
        const loSigo = await Usuario.loSigo(id_registrado, id_perfil);
        const seguidos_Cantidad = await Usuario.obtenerCantidadSeguidos(id_perfil);
        const seguidores_Cantidad = await Usuario.obtenerCantidadSeguidores(id_perfil);
        const publicaciones = await Publicacion.obtenerPublicacionesDeUnUsuario(id_perfil);

        let publicaciones_Seguidos = [];
        let publicaciones_Favoritas = [];
        let nombreListas = [];

        if (esMiPerfil) {
            const filas = await Usuario.obtenerSeguidos(id_registrado);
            const ID_Seguidos = filas.map(fila => fila.id);

            if (ID_Seguidos.length > 0) publicaciones_Seguidos = await Publicacion.obtenerPublicacionesDeVariosUsuarios(ID_Seguidos, id_registrado);
            publicaciones_Favoritas = await favoritos.obtenerTodasDeUnUsuario(id_registrado);
            nombreListas = await favoritos.obtenerListas(id_registrado);
        }

        res.render('perfil', {
            usuario: filas,
            publicaciones: publicaciones,
            seguidos: seguidos_Cantidad.Total,
            seguidores: seguidores_Cantidad.Total,
            publicaciones_Seguidos: publicaciones_Seguidos,
            publicaciones_Favoritas: publicaciones_Favoritas,
            nombreListas: nombreListas,
            loSigo: loSigo.length > 0,
            esMiPerfil,
            id: id_registrado
        });
    } catch (error) { next(error); }
}

async function seguidos(req, res, next) {
    try {
        const seguidos = await Usuario.obtenerSeguidos(req.params.id);
        res.render('seguidos-seguidores', { tipo: "seguidos", lista: seguidos, id_perfil: req.params.id });
    } catch (error) { next(error); }
}

async function seguidores(req, res, next) {
    try {
        const seguidores = await Usuario.obtenerSeguidores(req.params.id);
        res.render('seguidos-seguidores', { tipo: "seguidores", lista: seguidores, usuario: req.params.id });
    } catch (error) { next(error); }
}

async function alternarSeguimiento(req, res, next) {
    try {
        const id_seguidor = req.session.userId;
        const id_seguido = req.params.id;

        if (isNaN(Number(id_seguido))) { return res.status(400).json({ error: 'Dato inválido' }); }

        const loSigo = await Usuario.loSigo(id_seguidor, id_seguido);

        if (loSigo) {
            await Usuario.dejarDeSeguir(id_seguidor, id_seguido);
            await notificacion.crear({ "tipo_evento": 'Dejó de seguirte', "id_causante": id_seguidor, "id_dueño": id_seguido });
        } else {
            await Usuario.seguir(id_seguidor, id_seguido);
            await notificacion.crear({ "tipo_evento": 'Nuevo seguidor', "id_causante": id_seguidor, "id_dueño": id_seguido });
        }

        res.redirect(`/usuario/${id_seguido}/perfil`);
    } catch (error) { next(error); }
}

async function notificaciones(req, res, next) {
    try {
        const notificaciones = await notificacion.obtener(req.session.userId);
        res.render('notificaciones', { notificaciones });
    } catch (error) { next(); }
}

async function actualizarVisto(req, res, next) {
    try {
        const id_notificacion = req.params.id;

        if (isNaN(Number(id_notificacion))) { return res.status(400).json({ error: 'Dato inválido' }); }

        const vista = await notificacion.actualizarVisto(id_notificacion);
        res.json({ vista });
    } catch (error) { next(error); }
}

async function eliminarNotificaciones(req, res, next) {
    try {
        await notificacion.eliminar(req.session.userId);
        res.redirect('/usuario/notificaciones');
    } catch(error) { next(error); }
}

module.exports = {
    registrar,
    ingresar,
    modificar,
    perfil,
    seguidores,
    seguidos,
    alternarSeguimiento,
    notificaciones,
    actualizarVisto,
    eliminarNotificaciones
};