const Mensaje = require('../models/Mensaje');

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

module.exports = { crear, modificar, eliminar }