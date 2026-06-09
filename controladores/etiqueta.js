const { Etiqueta } = require('../models/index');

async function eliminar(req, res, next) {
    try {
        const { id } = req.body;
        if (isNaN(Number(id))) return res.status(400).render('error', { error: new Error('Datos inválidos') });
        await Etiqueta.destroy({ where: { id: id } });
        res.json({ ok: true });
    } catch (error) { next(error); }
}

module.exports = { eliminar }