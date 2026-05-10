const Likes = require('../models/Likes');
const Imagen = require('../models/Imagen');
const Mensaje = require('../models/Mensaje');
const Usuario = require('../models/Usuario');
const Favorito = require('../models/Favorito');
const Etiqueta = require('../models/Etiqueta');
const Denuncia = require('../models/Denuncia');
const Comentario = require('../models/Comentario');
const Publicacion = require('../models/Publicacion');
const Notificacion = require('../models/Notificacion');
const { Op } = require('sequelize');

async function registrar(req, res, next) {
    try {
        const { nombre, email, contraseña } = req.body;
        if (!nombre || !email || !contraseña) { res.render('registro', { error: 'Todos los campos son obligatorios' }); }

        const nuevoUsuario = await Usuario.create({ nombre, email, contraseña, registrado: true });
        req.session.userId = nuevoUsuario.id;

        res.redirect('/');
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') return res.render('registro', { error: 'Nombre en uso' });
        next(error);
    }
}

async function ingresar(req, res, next) {
    try {
        const { nombre, email, contraseña } = req.body;
        if (!nombre || !email || !contraseña) { res.render('registro', { error: 'Todos los campos son obligatorios' }); }

        const usuario = await Usuario.findOne({ where: { nombre, email, contraseña, registrado: true } });
        
        if (usuario) {
            req.session.userId = usuario.id;
            res.redirect('/');
        } else { res.render('ingreso', { error: 'Credenciales inválidas'}); }
    } catch (error) { next(error); }
}

async function modificar(req, res, next) {
    try {
        const id = req.session.userId;
        if (req.method === 'GET') {
            res.render('modificar', { usuario: await Usuario.findByPk(id) });
        } else {
            const { nombre, email, contrasena, descripcion } = req.body;
            const usuarioActual = await Usuario.findByPk(id);
            const foto_perfil = req.file ? `/uploads/${req.file.filename}` : usuarioActual.foto_perfil;

            if (!nombre || !email || !contrasena) { res.render('modificar', { usuario: usuarioActual, error: 'Hay campos incompletos' }); }

            await Usuario.update({ nombre: nombre, email: email, contraseña: contrasena, descripcion: descripcion, foto_perfil: foto_perfil }, { where: { id: id } });
            res.redirect(`/usuario/${id}/perfil`);
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') return res.render('modificar', { error: 'Nombre en uso' });
        next(error);
    }
}

async function perfil(req, res, next) {
    try {
        const id_perfil = req.params.id;
        const id_registrado = req.session.userId;
        const esMiPerfil = Number(id_perfil) === Number(id_registrado);

        if (isNaN(Number(id_perfil))) { return res.status(400).json({ error: 'Dato inválido' }); }

        const perfil = await Usuario.findByPk(id_perfil, { include: [{ association: 'Seguidores' }, { association: 'Seguidos' }] });

        const misPublicaciones = await Publicacion.findAll({ where: { id_usuario: id_perfil } });
        const idsPublicaciones = misPublicaciones.map(p => p.id);
        const publicaciones = await obtenerDatosCompletosPublicacion(idsPublicaciones);

        let loSigo = false;
        let publicaciones_Seguidos = [];
        let nombreListas = [];
        let favoritos = [];
        
        if (esMiPerfil) {
            const misSeguidos = await perfil.getSeguidos({ attributes: ['id'] });
            const idsSeguidos = misSeguidos.map(s => s.id);

            if (idsSeguidos.length > 0) {
                const pubs_Seguidos = await Publicacion.findAll({ where: { id_usuario: idsSeguidos } });
                const idsPublicaciones = pubs_Seguidos.map(p => p.id);
                publicaciones_Seguidos = await obtenerDatosCompletosPublicacion(idsPublicaciones);
            }

            const misFavoritos = await Favorito.findAll({ where: { id_usuario: id_registrado } });
            const idsFavoritos = misFavoritos.map(f => f.id_publicacion);
            favoritos = await obtenerDatosCompletosPublicacion(idsFavoritos);

            const listas = await Favorito.findAll({ where: { id_usuario: id_registrado }, attributes: ['nombre'], group: ['nombre'] });
            nombreListas = listas.map(l => l.nombre);
        } else {
            loSigo = await perfil.hasSeguidores(id_registrado);
        }

        res.render('perfil', {
            usuario: perfil,
            publicaciones,
            seguidos: perfil.Seguidos ? perfil.Seguidos.length : 0,
            seguidores: perfil.Seguidores ? perfil.Seguidores.length : 0,
            publicaciones_Seguidos,
            favoritos,
            nombreListas,
            loSigo,
            esMiPerfil,
            id: id_registrado
        });
    } catch (error) { next(error); }
}

async function seguidos(req, res, next) {
    try {
        const seguidos = await Usuario.findByPk(req.params.id, { include: [{ association: 'Seguidos' }] });
        res.render('seguidos-seguidores', { tipo: "seguidos", lista: seguidos, id_perfil: req.params.id });
    } catch (error) { next(error); }
}

async function seguidores(req, res, next) {
    try {
        const seguidores = await Usuario.findByPk(req.params.id, { include: [{ association: 'Seguidores' }] });
        res.render('seguidos-seguidores', { tipo: "seguidores", lista: seguidores, usuario: req.params.id });
    } catch (error) { next(error); }
}

async function alternarSeguimiento(req, res, next) {
    try {
        const id_seguidor = req.session.userId;
        const id_seguido = req.params.id;

        if (isNaN(Number(id_seguido))) { return res.status(400).json({ error: 'Dato inválido' }); }

        const seguidor = await Usuario.findByPk(id_seguidor);
        const seguido = await Usuario.findByPk(id_seguido);
        const loSigo = await seguidor.hasSeguidos(id_seguido);

        if (!seguido) return res.status(404).send('Usuario seguido no encontrado');

        if (loSigo) {
            await seguidor.removeSeguidos(id_seguido);
            await Notificacion.create({ tipo_evento: 'Dejó de seguirte', id_causante: id_seguidor, id_dueño: id_seguido });
        } else {
            await seguidor.addSeguidos(id_seguido);
            await Notificacion.create({ tipo_evento: 'Nuevo seguidor', id_causante: id_seguidor, id_dueño: id_seguido });
        }

        res.redirect(`/usuario/${id_seguido}/perfil`);
    } catch (error) { next(error); }
}

async function notificaciones(req, res, next) {
    try {
        const notificaciones = await Notificacion.findAll({
            where: { id_dueño: req.session.userId },
            include: [{ model: Usuario, as: 'Causante' }],
            order: [['createdAt', 'DESC']]
        });
        res.render('notificaciones', { notificaciones });
    } catch (error) { next(); }
}

async function actualizarVisto(req, res, next) {
    try {
        const id_notificacion = req.params.id;

        if (isNaN(Number(id_notificacion))) { return res.status(400).json({ error: 'Dato inválido' }); }

        const vista = await Notificacion.update({ vista: true }, { where: { id: id_notificacion } });
        res.json({ vista });
    } catch (error) { next(error); }
}

async function eliminarNotificaciones(req, res, next) {
    try {
        await Notificacion.destroy({ where: { id_dueño: req.session.userId } });
        res.redirect('/usuario/notificaciones');
    } catch(error) { next(error); }
}

async function chats(req, res, next) {
    try {
        const mensajes = await Mensaje.findAll({ where: { id_usuario: req.session.userId }, include: [{ model: Usuario, as: 'Receptor' }], order: [['createdAt', 'DESC']] });
        const usuario = await Usuario.findAll({ where: { id: req.session.userId } });
        const idsSeguidos = mensajes.map(m => m.id_seguido);
        const seguidos = await Usuario.findAll({ where: { id: { [Op.in]: idsSeguidos } } });
        res.render('chats', { mensajes, usuario, seguidos });
    } catch (error) { next(error); }
}

async function obtenerDatosCompletosPublicacion(ids) {
    if (!ids || ids.length === 0) return [];
    return await Publicacion.findAll({
        where: { id: { [Op.in]: ids } },
        include: [
            { model: Usuario, as: 'Usuario' },
            { model: Imagen },
            { model: Etiqueta },
            { model: Likes },
            { model: Denuncia },
            { model: Comentario, include: [{model: Usuario}] }
        ],
        order: [['createdAt', 'DESC']]
    });
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
    eliminarNotificaciones,
    chats
};