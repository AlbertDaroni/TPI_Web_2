const { Comentario, Notificacion, Usuario } = require('../models');

async function crear(req, res, next) {
    try {
        const texto = req.body.texto;
        const id_imagen = req.body.id_imagen;
        const id = req.session.userId;
        
        if (!texto || isNaN(Number(id_imagen))) return res.status(400).render('error', { error: new Error('Datos inválidos') });

        const nuevoComentario = await Comentario.create({ texto: texto, id_imagen: id_imagen, id_usuario: id });
        const comentarioCompleto = await Comentario.findByPk(nuevoComentario.id, { include: [{ model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }] });
        
        res.json(comentarioCompleto);
    } catch (error) { next(error); }
}

async function modificar(req, res, next) {
    try {
        const id = req.body.id;
        const texto = req.body.texto;

        if (!texto || isNaN(Number(id))) return res.status(400).render('error', { error: new Error('Datos inválidos') });

        await Comentario.update({ texto: texto }, { where: { id: id } });
        res.json({ ok: true });
    } catch (error) { next(error); }
}

async function denunciar(req, res, next) {
    try {
        if (req.method === 'GET') return res.render('denuncia', { tipo: "comentario", id_comentario: req.params.id });

        const id_dueno = req.session.userId;
        const motivo = req.body.motivo;
        const id_comentario = req.body.id_comentario;
    
        if (!motivo || isNaN(Number(id_comentario))) return res.status(400).render('error', { error: new Error('Datos inválidos') });

        const comentario = await Comentario.findByPk(id_comentario);
        await Notificacion.create({ tipo_evento: 'Denuncia', motivo: motivo, id_causante: id_dueno, id_dueno: comentario.id_usuario, id_comentario: id_comentario });

        res.json({ ok: true });
    } catch (error) { next(error); }
}

async function eliminar(req, res, next) {
    try {
        const id = req.body.id;

        if (isNaN(Number(id))) return res.status(400).render('error', { error: new Error('Datos inválidos') });

        await Comentario.destroy({ where: { id: id } });
        res.json({ ok: true });
    } catch (error) { next(error); }
}

module.exports = {
    crear,
    modificar,
    denunciar,
    eliminar
}