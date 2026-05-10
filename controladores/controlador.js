const sequelize = require('../config/db');
const { Likes, Imagen, Usuario, Denuncia, Etiqueta, Validador, Comentario, Publicacion, Notificacion } = require('../models/index'); 
const { Op } = require('sequelize');

async function contenidoPaginaPrincipal(req, res, next) {
    try {
        const esValido = await controlDeDenuncias(req, next);
        if (!esValido) { res.render('notificaciones'); }

        const publicaciones = await Publicacion.findAll({
            order: sequelize.random(), limit: 10,
            include: [
                { model: Imagen }, { model: Usuario }, { model: Etiqueta },
                { model: Comentario, include: [Usuario] }, { model: Likes }
            ]
        });
        const usuario = await Usuario.findByPk(req.session.userId);
        
        res.render('index', { datos: publicaciones, usuario });
    } catch (error) { next(error); }
}

async function controlDeDenuncias(req, next) {
    try {
        let pasa = true;
        const id_usuario = req.session.userId;
        const publicaciones = await Publicacion.findAll({ where: { id_usuario: id_usuario, denuncias: { [Op.gt]: 2 } } });
        const comentarios = await Comentario.findAll({ where: { id_usuario: id_usuario, denuncias: { [Op.gt]: 2 } } });
        
        if (publicaciones.length > 0) { for (const pub of publicaciones) { await Validador.create({ id_publicacion: pub.id }); } pasa = false; }
        if (comentarios.length > 0) pasa = false;
        
        const ids_publicacion = publicaciones.map(pub => pub.id);
        const ids_comentario = comentarios.map(com => com.id);
        const denunciasPubs = await Denuncia.findAll({ where: { id_publicacion: { [Op.in]: ids_publicacion }, notificada: false } });
        const denunciasComs = await Denuncia.findAll({ where: { id_comentario: { [Op.in]: ids_comentario }, notificada: false } });

        for (const d of denunciasPubs) {
            await Notificacion.create({
                tipo_evento: 'Denuncia', motivo: d.motivo, id_dueño: id_usuario,
                id_causante: d.id_usuario, id_publicacion: d.id_publicacion
            });
            await d.update({ notificada: true });
        }
        for (const d of denunciasComs) {
            await Notificacion.create({
                tipo_evento: 'Denuncia', motivo: d.motivo, id_dueño: id_usuario,
                id_causante: d.id_usuario, id_comentario: d.id_comentario
            });
            await d.update({ notificada: true });
        }

        return pasa;
    } catch (error) { next(error); }
}

async function controlDeContenido(req, res, next) {
    try {
        
    } catch (error) { next(error); }
}

async function buscar(req, res, next) {
    try {
        if (!req.params.nombre) return res.status(404).send('Datos inválidos');
        const usuarios = await Usuario.findAll({ where: { nombre: req.params.nombre } });
        const publicaciones = await Publicacion.findAll({ where: { titulo: req.params.nombre } });
        res.render('buscar', { usuarios, publicaciones });
    } catch (error) { next(); }
}

module.exports = { contenidoPaginaPrincipal, controlDeContenido, buscar };