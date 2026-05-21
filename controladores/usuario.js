const { Imagen, Mensaje, Usuario, Denuncia, Etiqueta, Favorito, Comentario, Publicacion, Notificacion } = require('../models/index'); 
const { Op } = require('sequelize');

async function registrar(req, res, next) {
    try {
        const { nombre, email, contrasena } = req.body;
        if (!nombre || !email || !contrasena) { res.render('registro', { error: 'Todos los campos son obligatorios' }); }

        const nuevoUsuario = await Usuario.create({ nombre, email, contrasena, registrado: true });
        req.session.userId = nuevoUsuario.id;

        res.redirect('/');
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') return res.render('registro', { error: 'Nombre en uso' });
        next(error);
    }
}

async function ingresar(req, res, next) {
    try {
        const { nombre, email, contrasena } = req.body;
        if (!nombre || !email || !contrasena) { res.render('registro', { error: 'Todos los campos son obligatorios' }); }

        const usuario = await Usuario.findOne({ where: { nombre, email, contrasena, registrado: true } });
        
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

            await Usuario.update({ nombre: nombre, email: email, contrasena: contrasena, descripcion: descripcion, foto_perfil: foto_perfil }, { where: { id: id } });
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
        if (!perfil) return res.status(404).render('error', { error: new Error('Usuario no encontrado') });

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
                const pubs_Seguidos = await Publicacion.findAll({ where: { id_usuario: { [Op.in]: idsSeguidos } } });
                const idsPublicaciones = pubs_Seguidos.map(p => p.id);
                publicaciones_Seguidos = await obtenerDatosCompletosPublicacion(idsPublicaciones);
            }
            if (id_registrado) {
                const misFavoritos = await Favorito.findAll({ where: { id_usuario: id_registrado } });
                const idsFavoritos = misFavoritos.map(f => f.id_publicacion);
                favoritos = await obtenerDatosCompletosPublicacion(idsFavoritos);
    
                const listas = await Favorito.findAll({ where: { id_usuario: id_registrado }, attributes: ['nombre'], group: ['nombre'] });
                nombreListas = listas.map(l => l.nombre);
            }
        } else {
            if (id_registrado) loSigo = await perfil.hasSeguidores(id_registrado);
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
        const seguidos = await Usuario.findByPk(req.params.id, { include: [{ model: Usuario, as: 'Seguidos' }] });
        res.render('seguidos-seguidores', { tipo: "seguidos", lista: seguidos.Seguidos });
    } catch (error) { next(error); }
}

async function seguidores(req, res, next) {
    try {
        const seguidores = await Usuario.findByPk(req.params.id, { include: [{ model: Usuario, as: 'Seguidores' }] });
        res.render('seguidos-seguidores', { tipo: "seguidores", lista: seguidores.Seguidores });
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
            await Notificacion.create({ tipo_evento: 'Dejó de seguirte', id_causante: id_seguidor, id_dueno: id_seguido });
        } else {
            await seguidor.addSeguidos(id_seguido);
            await Notificacion.create({ tipo_evento: 'Nuevo seguidor', id_causante: id_seguidor, id_dueno: id_seguido });
        }

        res.redirect(`/usuario/${id_seguido}/perfil`);
    } catch (error) { next(error); }
}

async function notificaciones(req, res, next) {
    try {
        const notificaciones = await Notificacion.findAll({
            where: { id_dueno: req.session.userId },
            include: [{ model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'], as: 'Causante' }],
            order: [['createdAt', 'DESC']]
        });
        res.render('notificaciones', { notificaciones });
    } catch (error) { next(); }
}

async function filtrarNotificaciones(req, res, next) {
    try {
        const opcion = req.body.opcion;
        const id = req.session.userId;

        let whereClause = {};
        if (opcion === "todas") whereClause = { id_dueno: id };
        else if (opcion === 'leidas') whereClause = { id_dueno: id, vista: true };
        else if (opcion === 'no-leidas') whereClause = { id_dueno: id, vista: false };
        else if (['Denuncia', 'Interés', 'Valorizó', 'Comentó'].includes(opcion)) whereClause = { id_dueno: id, tipo_evento: opcion };
        else return res.status(404).render('error', { error: new Error('Dato inválido') });

        const notificaciones = await Notificacion.findAll({ 
            where: whereClause, 
            include: [{ model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'], as: 'Causante' }],
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
        res.json({ vista: vista[0] === 1 ? true : false });
    } catch (error) { next(error); }
}

async function eliminarNotificaciones(req, res, next) {
    try {
        await Notificacion.destroy({ where: { id_dueno: req.session.userId } });
        res.redirect('/usuario/notificaciones');
    } catch(error) { next(error); }
}

async function chats(req, res, next) {
    try {
        const mensajes = await Mensaje.findAll({ 
            where: { id_usuario: req.session.userId }, 
            include: [{ model: Usuario, as: 'Receptor' }], order: [['createdAt', 'DESC']] 
        });
        res.render('chats', { mensajes });
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
    filtrarNotificaciones,
    actualizarVisto,
    eliminarNotificaciones,
    chats
};