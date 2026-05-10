const Denuncia = require('../models/Denuncia');
const Comentario = require('../models/Comentario');
const Publicacion = require('../models/Publicacion');
const Notificacion = require('../models/Notificacion');

async function crear(req, res, next) {
    try {
        const texto = req.body.comentario;
        const id_publicacion = req.params.id;
        const id = req.session.userId;
        
        if (!texto || isNaN(Number(id_publicacion))) { return res.status(400).json({ error: 'Datos inválidos' }); }

        await Comentario.create({ texto: texto, id_publicacion: id_publicacion, id_usuario: id });

        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

async function modificar(req, res, next) {
    try {
        const id_publicacion = req.params.id_publicacion;
        const id_comentario = req.params.id_comentario;
        const texto = req.body.comentario;

        if (!texto || isNaN(Number(id_publicacion)) || isNaN(Number(id_comentario))) { return res.status(400).json({ error: 'Datos inválidos' }); }

        await Comentario.update({ texto: texto }, { where: { id: id_comentario } });
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

async function denunciar(req, res, next) {
    try {
        if (req.method === 'GET') return res.render('denuncia', { id_comentario: req.params.id });

        const id_dueño = req.session.userId;
        const motivo = req.body.descripcion;
        const id_comentario = req.params.id;
    
        if (!motivo || isNaN(Number(id_comentario))) { return res.status(400).json({ error: 'Datos inválidos' }); }

        const comentario = await Comentario.findByPk(id_comentario, { include: [Publicacion] });
        await comentario.increment('denuncias' ,{ by: 1 });
        await Denuncia.create({ motivo: motivo, id_comentario: id_comentario });
        await Notificacion.create({ tipo_evento: 'Denuncia', motivo: motivo, id_causante: id_dueño, id_dueño: comentario.id_usuario });

        res.redirect(`/#pub-${comentario.id_publicacion}`);
    } catch (error) { next(error); }
}

async function eliminar(req, res, next) {
    try {
        const id_comentario = req.params.id_comentario;
        const id_publicacion = req.params.id_publicacion;

        if (isNaN(Number(id_comentario)) || isNaN(Number(id_publicacion))) { res.status(400).json({ error: 'Datos inválidos' }); }

        await Comentario.destroy({ where: { id: id_comentario } });
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

module.exports = {
    crear,
    modificar,
    denunciar,
    eliminar
}