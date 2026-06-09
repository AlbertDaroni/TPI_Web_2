const { Imagen, Valoracion, Publicacion, Notificacion } = require('../models/index');

async function denunciar(req, res, next) {
    try {
        if (req.method === 'GET') return res.render('denuncia', { tipo: "imagen", id_imagen: req.params.id });
        
        const id_dueño = req.session.userId;
        const { motivo, id_imagen, opcion } = req.body;

        if (!motivo || !opcion || isNaN(Number(id_imagen))) return res.status(400).render('error', { error: new Error('Datos inválidos') });
            
        const imagen = await Imagen.findByPk(id_imagen, { include: [{ model: Publicacion }] });
        await Notificacion.create({
            tipo_evento: 'Denuncia',
            motivo: opcion + ':' + motivo,
            id_causante: id_dueño,
            id_dueno: imagen.Publicacion.id_usuario,
            id_imagen: id_imagen
        });
            
        res.redirect('/');
    } catch (error) { next(error); }
}

async function eliminar(req, res, next) {
    try {
        const id = req.params.id;
        if (isNaN(Number(id))) return res.status(400).render('error', { error: new Error('Datos inválidos') });
        await Imagen.destroy({ where: { id: id } });

        res.redirect('back');
    } catch (error) { next(error); }
}

async function alternarComentarios(req, res, next) {
    try {
        const { id_imagen, comentarios } = req.body;

        if (isNaN(Number(id_imagen)) || typeof comentarios !== 'boolean') return res.status(400).render('error', { error: new Error('Datos inválidos') });
        await Imagen.update({ comentarios: comentarios === true ? false : true }, { where: { id: id_imagen } });
        res.json({ ok: comentarios === true ? false : true });
    } catch (error) { next(error); }
}

async function actualizarValoracion(req, res, next) {
    try {
        const { id, valoracion } = req.body;
        if (isNaN(Number(id)) || valoracion === undefined) return res.status(400).json({ error: 'Datos inválidos' });

        await Valoracion.create({ valoracion: valoracion, id_imagen: id, id_usuario: req.session.userId });

        const imagen = await Imagen.findByPk(id, { include: [Valoracion] });
        const datosPlanos = imagen.toJSON();
        const valoraciones = datosPlanos.Valoracions || [];
        const valoracionesPositivas = valoraciones.filter(v => v.valoracion === true);
        const promedio = valoraciones.length > 0 ? valoracionesPositivas.length / valoraciones.length * 100 : 0;
        datosPlanos.promedio = promedio;
        
        res.json({ promedio: Math.round(promedio), cantidad: valoraciones.length });
    } catch (error) { next(error); }
}

module.exports = { denunciar, eliminar, actualizarValoracion, alternarComentarios }