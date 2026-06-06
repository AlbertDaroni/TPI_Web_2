const { Mensaje, Usuario } = require('../models');
const { Op } = require('sequelize');

async function obtener(req, res, next) {
    try {
        const usuario = await Usuario.findByPk(req.session.userId, { attributes: ['id', 'nombre', 'foto_perfil'] });
        const [seguidos, seguidores] = await Promise.all([
            await usuario.getSeguidos({ attributes: ['id', 'nombre', 'foto_perfil'] }),
            await usuario.getSeguidores({ attributes: ['id', 'nombre', 'foto_perfil'] })
        ]);

        const listaCompleta = [...seguidos, ...seguidores].map(u => u.toJSON());
        const contactosMap = new Map();
        listaCompleta.forEach(contacto => { contactosMap.set(contacto.id, contacto); });
        const contactos = Array.from(contactosMap.values());

        res.render('chats', { contactos, usuario });
    } catch (error) { next(error); }
}

async function obtenerChat(req, res, next) {
    try {
        const id_usuario = req.session.userId;
        const id_seguido = req.body.id_seguido;
        const mensajes = await Mensaje.findAll({
            where: { [Op.or]: [
                { id_usuario: id_usuario, id_seguido: id_seguido },
                { id_usuario: id_seguido, id_seguido: id_usuario }
            ] },
            include: [
                { model: Usuario, as: 'Emisor', attributes: ['id'] },
                { model: Usuario, as: 'Receptor', attributes: ['id'] }
            ],
            order: [['createdAt', 'ASC']]
        });

        res.json(mensajes);
    } catch(error) { next(error); }
}

async function crear(req, res, next) {
    try {
        const id_usuario = req.session.userId;
        const { texto, id_seguido } = req.body;
        if (!texto || isNaN(Number(id_seguido))) return res.status(400).json({ error: 'Datos inválidos' });

        const mensaje = await Mensaje.create({ id_usuario: id_usuario, id_seguido: id_seguido, texto: texto });
        res.json(mensaje);
    } catch (error) { next(error); }
}

async function modificar(req, res, next) {
    try {
        const { texto, id_mensaje } = req.body;
        if (!texto || isNaN(Number(id_mensaje))) return res.status(400).json({ error: 'Datos inválidos' });
        await Mensaje.update({ texto: texto }, { where: { id: id_mensaje } });
        res.json({ success: true });
    } catch (error) { next(error); }
}

async function eliminar(req, res, next) {
    try {
        const { id } = req.body;
        if (isNaN(Number(id))) return res.status(400).json({ error: 'Datos inválidos' });
        await Mensaje.destroy({ where: { id: id } });
        res.json({ ok: true });
    } catch (error) { next(error); }
}

module.exports = { obtener, obtenerChat, crear, modificar, eliminar }