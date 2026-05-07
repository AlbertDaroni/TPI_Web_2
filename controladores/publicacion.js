const imagen = require('../models/Imagen');
const Etiqueta = require('../models/Etiqueta');
const Denuncia = require('../models/Denuncia');
const Favorito = require('../models/Favorito');
const Comentario = require('../models/Comentario');
const Publicacion = require('../models/Publicacion');
const Notificacion = require('../models/Notificacion');

async function crearPublicacion(req, res, next) {
    try {
        const id = req.session.userId;
        if (req.method === 'GET') {
            res.render('agregar', { id });
        } else {
            const { titulo, descripcion, licencia, etiquetas } = req.body;

            if (titulo.trim() === '' || req.files.length === 0 || etiquetas.length === 0) { res.render('agregar', { error: 'Campos incompletos' }); }
            for (const etiqueta of etiquetas) { if (etiqueta.trim() === '') { res.render('agregar', { error: 'Campos incompletos' }); } }
            
            const nuevaPublicacion = await Publicacion.crear({ "titulo": titulo, "descripcion": descripcion, "id_usuario": id });
            const id_publicacion = nuevaPublicacion.id;

            for (const i of req.files) { await imagen.crear({ "imagen": `/uploads/${i.filename}`, "licencia": licencia, "id_publicacion": id_publicacion }); }
            for(const e of etiquetas) { await Etiqueta.crear({ "titulo": e, "id_publicacion": id_publicacion }); }
    
            res.redirect('/');
        }
    } catch (error) { next(error); }
}

async function agregarComentario(req, res, next) {
    try {
        const texto = req.body.comentario;
        const id_publicacion = req.params.id;
        const id = req.session.userId;
        
        if (texto.trim() === '' || isNaN(Number(id_publicacion))) { return res.status(400).json({ error: 'Texto vacío' }); }

        await Comentario.crear({ "comentario": texto, "id_publicacion": id_publicacion, "id_usuario": id });

        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

async function modificarComentario(req, res, next) {
    try {
        const { id_publicacion, id_comentario} = req.params;
        const texto = req.body.comentario;

        if (texto.trim() === '' || isNaN(Number(id_publicacion)) || isNaN(Number(id_comentario))) { return res.status(400).json({ error: 'Datos inválidos' }); }

        const viejoComentario = await Comentario.obtener(id_comentario);
        await Comentario.modificar({ "comentario": texto, "denuncias": viejoComentario.denuncias, "id": id_comentario });
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

async function denunciarPublicacion(req, res, next) {
    try {
        if (req.method === 'GET') {
            if (isNaN(Number(req.params.id))) { res.render('denuncia', { error: 'Dato inválido' }); }
            res.render('denuncia', { id_publicacion: req.params.id });
        } else {
            const id_dueño = req.session.userId;
            const descripcion = req.body.descripcion;
            const id_publicacion = req.params.id;

            if (descripcion.trim() === '' || isNaN(Number(id_publicacion))) { return res.status(400).json({ error: 'Datos inválidos' }); }
            
            await Denuncia.crear({ "descripcion": descripcion, "id_publicacion": id_publicacion });
            await Publicacion.actualizarDenuncias("suma", id_publicacion);
            const usuarioDueño = await Publicacion.obtenerDueño(id_publicacion);
            await Notificacion.crear({ "tipo_evento": 'Denuncia', "motivo": descripcion, "id_causante": id_dueño, "id_dueño": usuarioDueño, "id_publicacion": id_publicacion });
            
            res.redirect(`/#pub-${id_publicacion}`);
        }
    } catch (error) { next(error); }
}

async function denunciarComentario(req, res, next) {
    try {
        if (req.method === 'GET') {
            if (isNaN(Number(req.params.id))) return;
            res.render('denuncia', { id_comentario: req.params.id });
        } else {
            const id_dueño = req.session.userId;
            const descripcion = req.body.descripcion;
            const id_comentario = req.params.id;
    
            if (descripcion.trim() === '' || isNaN(Number(id_comentario))) { return res.status(400).json({ error: 'Datos inválidos' }); }

            await Denuncia.crear({ "descripcion": descripcion, "id_comentario": id_comentario });
            await Comentario.actualizarDenuncias("suma", id_comentario);
            const usuarioDueño = await Comentario.obtenerDueño(id_comentario);
            await Notificacion.crear({ "tipo_evento": 'Denuncia', "motivo": descripcion, "id_causante": id_dueño, "id_dueño": usuarioDueño });
            const id_publicacion = await Comentario.obtenerPublicacionCorrespondiente(id_comentario);

            res.redirect(`/#pub-${id_publicacion}`);
        }
    } catch (error) { next(error); }
}

async function eliminarPublicacion(req, res, next) {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.userId;

        if (isNaN(Number(id_publicacion))) { return res.status(400).json({ error: 'Dato inválido' }); }

        await Publicacion.eliminar(id_publicacion);

        res.redirect(`/usuario/${id_usuario}/perfil`);
    } catch (error) { next(error); }
}

async function eliminarComentario(req, res, next) {
    try {
        const id_comentario = req.params.id_comentario;
        const id_publicacion = req.params.id_publicacion;

        if (isNaN(Number(id_comentario)) || isNaN(Number(id_publicacion))) { res.status(400).json({ error: 'Datos inválidos' }); }

        await Comentario.eliminar(id_comentario);
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

async function marcarInteres(req, res, next) {
    try {
        const id_publicacion = req.params.id;
        const id_usuario_interesado = req.session.userId;
        const motivoInteres = req.body.motivoInteres;

        if (isNaN(Number(id_publicacion)) || motivoInteres.trim() === '') { res.status(400).json({ error: 'Datos inválidos' }); }
        
        const dueño = await Publicacion.obtenerPorID(id_publicacion);
        const id_usuario_dueño = dueño[0].id_usuario;
        await Notificacion.crear({ "tipo_evento": 'Interés', "motivo": motivoInteres, "id_causante": id_usuario_interesado, "id_dueño": id_usuario_dueño, "id_publicacion": id_publicacion });

        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

async function guardarPublicacion(req, res, next) {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.userId;
        const nombreLista = req.body.nombreLista;

        if (isNaN(Number(id_publicacion)) || nombreLista.trim() === '') { res.status(400).json({ error: 'Datos inválidos' }); }

        await Favorito.crear({ "nombre": nombreLista, "id_publicacion": id_publicacion, "id_usuario": id_usuario });
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

module.exports = {
    crearPublicacion,
    agregarComentario,
    modificarComentario,
    denunciarPublicacion,
    denunciarComentario,
    eliminarPublicacion,
    eliminarComentario,
    marcarInteres,
    guardarPublicacion
};