const { Mensaje, Usuario } = require('../models');
const { Op } = require('sequelize');

async function obtener(req, res, next) {
    try {
        const userId = req.session.userId;
        const mensajes = await Mensaje.findAll({ 
            where: { [Op.or]: [{ id_usuario: userId }, { id_seguido: userId }] }, 
            include: [
                { model: Usuario, as: 'Receptor', attributes: ['id', 'nombre', 'foto_perfil'] },
                { model: Usuario, as: 'Emisor', attributes: ['id', 'nombre', 'foto_perfil'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        const contactos = mensajes.forEach(m => {
            const contacto = m.id_usuario === userId ? m.Receptor : m.Emisor;
            if (contacto && contacto.id !== userId) return contacto;
        });

        res.render('chats', { mensajes, contactos, userId });
    } catch (error) { next(error); }
}

async function crear(req, res, next) {
    try {
        const id_usuario = req.session.userId;
        const id_seguido = req.params.id;
        const texto = req.body.texto;

        if (!texto || isNaN(Number(id_seguido))) return res.status(400).json({ error: 'Datos inválidos' });

        const mensaje = await Mensaje.create({ id_usuario: id_usuario, id_seguido: id_seguido, texto: texto });

        res.json(mensaje);
    } catch (error) { next(error); }
}

async function modificar(req, res, next) {
    try {
        const id_mensaje = req.params.id;
        const texto = req.body.texto;
        if (!texto || isNaN(Number(id_mensaje))) return res.status(400).json({ error: 'Datos inválidos' });
        await Mensaje.update({ texto: texto }, { where: { id: id_mensaje } });
        res.json({ success: true });
    } catch (error) { next(error); }
}

async function eliminar(req, res, next) {
    try {
        const id_mensaje = req.params.id;
        if (isNaN(Number(id_mensaje))) return res.status(400).json({ error: 'Datos inválidos' });
        await Mensaje.destroy({ where: { id: id_mensaje } });
        res.sendStatus(200);
    } catch (error) { next(error); }
}

module.exports = { obtener, crear, modificar, eliminar }