const { Notificacion, Usuario, Imagen, Publicacion, Comentario } = require('../models/index');
const { Op } = require('sequelize');

async function obtener(req, res, next) {
    try {
        const notificaciones = await Notificacion.findAll({
            where: { id_dueno: req.session.userId },
            include: [
                { model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'], as: 'Causante' },
                { model: Imagen, include: [{ model: Publicacion }] },
                { model: Comentario, include: [{ model: Imagen, attributes: ['id_publicacion'] }] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.render('notificaciones', { notificaciones });
    } catch (error) { next(error); }
}

async function filtrar(req, res, next) {
    try {
        const opcion = req.body.opcion;
        const id = req.session.userId;

        let whereClause = { id_dueno: id };
        if (opcion === 'leidas') whereClause.vista = true;
        else if (opcion === 'no-leidas') whereClause.vista = false;
        else if (opcion === 'Seguimiento') whereClause[Op.or] = [{ tipo_evento: 'Nuevo seguidor' }, { tipo_evento: 'Dejó de seguirte' }];
        else if (['Denuncia', 'Interés', 'Valorizó', 'Comentó'].includes(opcion)) whereClause.tipo_evento = opcion;
        else if (opcion !== 'todas') return res.status(404).render('error', { error: new Error('Dato inválido') });

        const notificaciones = await Notificacion.findAll({ 
            where: whereClause, 
            include: [
                { model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'], as: 'Causante' },
                { model: Imagen, include: [{ model: Publicacion }] },
                { model: Comentario, include: [{ model: Imagen, attributes: ['id_publicacion'] }] }
            ],
            order: [['createdAt', 'DESC']] 
        });
        res.render('notificaciones', { notificaciones });
    } catch (error) { next(error); }
}

async function actualizarVisto(req, res, next) {
    try {
        const id = req.body.id;

        if (isNaN(Number(id))) { return res.status(400).render('error', { error: new Error('Dato inválido') }); }

        const vista = await Notificacion.update({ vista: true }, { where: { id: id } });
        res.json({ vista: vista[0] === 1 ? true : false });
    } catch (error) { next(error); }
}

async function eliminar(req, res, next) {
    try {
        const { id } = req.body;
        if (id) await Notificacion.destroy({ where: { id: id } });
        await Notificacion.destroy({ where: { id_dueno: req.session.userId } });
        res.redirect('/notificacion');
    } catch(error) { next(error); }
}

module.exports= { obtener, filtrar, actualizarVisto, eliminar }