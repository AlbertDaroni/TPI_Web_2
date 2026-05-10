const Imagen = require('../models/Imagen');
const Etiqueta = require('../models/Etiqueta');
const Denuncia = require('../models/Denuncia');
const Favorito = require('../models/Favorito');
const Publicacion = require('../models/Publicacion');
const Notificacion = require('../models/Notificacion');

async function crear(req, res, next) {
    try {
        const id = req.session.userId;
        if (req.method === 'GET') return res.render('agregar', { id });

        const { titulo, descripcion, licencia, etiquetas } = req.body;

        if (!titulo  || !licencia || req.files.length === 0 || etiquetas.length === 0) { res.render('agregar', { error: 'Campos incompletos' }); }
        for (const etiqueta of etiquetas) { if (!etiqueta) { res.render('agregar', { error: 'Campos incompletos' }); } }
            
        const nuevaPublicacion = await Publicacion.create({ titulo: titulo, descripcion: descripcion, id_usuario: id });
        const nuevasImagenes = req.files.map(i => { Imagen.create({ imagen: `/uploads/${i.filename}`, licencia, id_publicacion: nuevaPublicacion.id }); });
        const listaEtiquetas = Array.isArray(etiquetas) ? etiquetas : [etiquetas];
        const nuevasEtiquetas = listaEtiquetas.map(e => { Etiqueta.create({ nombre: e.startsWith('#') ? e : '#' + e, id_publicacion: nuevaPublicacion.id }); });

        await Promise.all([...nuevasImagenes, ...nuevasEtiquetas]);
        res.redirect('/');
    } catch (error) { next(error); }
}

async function modificar(req, res, next) {
    try {
        const { titulo, descripcion, etiquetas, imagenes } = req.body;
        const id_publicacion = req.params.id;

        if (!titulo || etiquetas.length === 0 || imagenes.length === 0 || isNaN(Number(id_publicacion))) 
            { res.render('modificarPublicacion', { error: 'Datos inválidos' }); }

        await Publicacion.update({ titulo: titulo, descripcion: descripcion }, { where: { id: id_publicacion } });
        for (const img of imagenes) {
            await Imagen.update({ imagen: img.imagen, licencia: img.licencia, copyright: img.copyright },
                { where: { id_publicacion: id_publicacion } });
        }
        for (const tag of etiquetas) {
            await Etiqueta.update({ nombre: tag.nombre },
                { where: { id_publicacion: id_publicacion } });
        }

        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

async function eliminar(req, res, next) {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.userId;

        if (isNaN(Number(id_publicacion))) { return res.status(400).json({ error: 'Dato inválido' }); }

        await Publicacion.destroy({ where: { id: id_publicacion } });

        res.redirect(`/usuario/${id_usuario}/perfil`);
    } catch (error) { next(error); }
}

async function denunciar(req, res, next) {
    try {
        if (req.method === 'GET') return res.render('denuncia', { id_publicacion: req.params.id });
        
        const id_dueño = req.session.userId;
        const motivo = req.body.descripcion;
        const id_publicacion = req.params.id;

        if (!motivo || isNaN(Number(id_publicacion))) { return res.status(400).json({ error: 'Datos inválidos' }); }
            
        const publicacion = await Publicacion.findByPk(id_publicacion);
        await publicacion.increment('denuncias', { by: 1 });
        await Denuncia.create({ motivo: motivo, id_publicacion: id_publicacion });
        await Notificacion.create({ tipo_evento: 'Denuncia', motivo: motivo, id_causante: id_dueño, id_dueño: publicacion.id_usuario, id_publicacion: id_publicacion });
            
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

async function marcarInteres(req, res, next) {
    try {
        const id_publicacion = req.params.id;
        const id_usuario_interesado = req.session.userId;
        const motivo = req.body.motivoInteres;

        if (isNaN(Number(id_publicacion)) || motivo.trim() === '') { res.status(400).json({ error: 'Datos inválidos' }); }
        
        const publicacion = await Publicacion.findByPk(id_publicacion);
        const id_usuario_dueño = publicacion.id_usuario;
        await Notificacion.create({ tipo_evento: 'Interés', motivo: motivo, id_causante: id_usuario_interesado, id_dueño: id_usuario_dueño, id_publicacion: id_publicacion });

        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

async function guardar(req, res, next) {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.userId;
        const nombreLista = req.body.nombreLista;

        if (isNaN(Number(id_publicacion)) || nombreLista.trim() === '') { res.status(400).json({ error: 'Datos inválidos' }); }

        await Favorito.create({ nombre: nombreLista, id_publicacion: id_publicacion, id_usuario: id_usuario });
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

module.exports = {
    crear,
    modificar,
    eliminar,
    denunciar,
    marcarInteres,
    guardar
}