const { Imagen, Usuario, Etiqueta, Favorito, Comentario, Valoracion, Publicacion, Notificacion } = require('../models/index');

async function crear(req, res, next) {
    try {
        const id = req.session.userId;
        if (req.method === 'GET') return res.render('agregar', { id });

        const { titulo, descripcion, licencias, marcasDeAgua, etiquetas } = req.body;

        if (!titulo || req.files.length === 0 || etiquetas.length === 0 || licencias.length === 0) { res.render('agregar', { error: 'Campos incompletos' }); }
        for (const licencia of licencias) { if (licencia === undefined) { res.render('agregar', { error: 'Campos incompletos' }); } }
        for (const etiqueta of etiquetas) { if (!etiqueta) { res.render('agregar', { error: 'Campos incompletos' }); } }
            
        const nuevaPublicacion = await Publicacion.create({ titulo: titulo, descripcion: descripcion, id_usuario: id });
        const nuevasImagenes = req.files.map((imagen, indice) => {
            return Imagen.create({ imagen: `/uploads/${imagen.filename}`, licencia: licencias[indice], marcaDeAgua: marcasDeAgua[indice], id_publicacion: nuevaPublicacion.id });
        });
        const listaEtiquetas = Array.isArray(etiquetas) ? etiquetas : [etiquetas];
        const nuevasEtiquetas = listaEtiquetas.map(e => {
            const etiquetasFiltradas = e.startsWith('#') ? e.split('#')[1].toLowerCase() : e.toLowerCase();
            return Etiqueta.create({ nombre: etiquetasFiltradas, id_publicacion: nuevaPublicacion.id });
        });

        await Promise.all([...nuevasImagenes, ...nuevasEtiquetas]);
        res.redirect('/');
    } catch (error) { next(error); }
}

async function modificar(req, res, next) {
    try {
        const { id, titulo, descripcion, idsEtiquetas, etiquetas } = req.body;
        console.log(id, titulo, descripcion, idsEtiquetas, etiquetas);
        
        await Publicacion.update({ titulo: titulo, descripcion: descripcion }, { where: { id: id } });
        if (etiquetas && etiquetas.length > 0 && idsEtiquetas && idsEtiquetas.length > 0) {
            for (let i = 0; i < etiquetas.length; i++) {
                await Etiqueta.update({ nombre: etiquetas[i] }, { where: { id: idsEtiquetas[i] } });
            }
        }

        res.json({ titulo: titulo, descripcion: descripcion, etiquetas: etiquetas });
    } catch (error) { next(error); }
}

async function modificarEtiqueta(req, res, next) {
    try {
        const { id, nombre } = req.body;
        if (isNaN(Number(id)) || !nombre) return res.status(400).render('error', { error: new Error('Datos inválidos') });
        const nuevaEtiqueta = await Etiqueta.update({ nombre: nombre }, { where: { id: id } });
        res.json({ ok: true });
    } catch (error) { next(error); }
}

async function eliminarEtiqueta(req, res, next) {
    try {
        const { id } = req.body;
        if (isNaN(Number(id))) return res.status(400).render('error', { error: new Error('Datos inválidos') });
        await Etiqueta.destroy({ where: { id: id } });
        res.json({ ok: true });
    } catch (error) { next(error); }
}

async function eliminarImagen(req, res, next) {
    try {
        const id = req.params.id;
        if (isNaN(Number(id))) return res.status(400).render('error', { error: new Error('Datos inválidos') });
        await Imagen.destroy({ where: { id: id } });

        res.redirect('back');
    } catch (error) { next(error); }
}

async function eliminar(req, res, next) {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.userId;

        if (isNaN(Number(id_publicacion))) return res.status(400).render('error', { error: new Error('Datos inválidos') });
        await Publicacion.destroy({ where: { id: id_publicacion } });

        res.redirect(`/usuario/${id_usuario}/perfil`);
    } catch (error) { next(error); }
}

async function denunciar(req, res, next) {
    try {
        if (req.method === 'GET') return res.render('denuncia', { tipo: "imagen",id_imagen: req.params.id });
        
        const id_dueño = req.session.userId;
        const motivo = req.body.motivo;
        const id_imagen = req.body.id_imagen;

        if (!motivo || isNaN(Number(id_imagen))) return res.status(400).render('error', { error: new Error('Datos inválidos') });
            
        const imagen = await Imagen.findByPk(id_imagen, { include: [{ model: Publicacion }] });
        await Notificacion.create({ tipo_evento: 'Denuncia', motivo: motivo, id_causante: id_dueño, id_dueno: imagen.Publicacion.id_usuario, id_imagen: id_imagen });
            
        res.redirect('/');
    } catch (error) { next(error); }
}

async function marcarInteres(req, res, next) {
    try {
        const id_publicacion = req.params.id;
        const id_usuario_interesado = req.session.userId;
        const motivo = req.body.motivoInteres;

        if (isNaN(Number(id_publicacion)) || !motivo) { res.status(400).json({ error: 'Datos inválidos' }); }
        
        const publicacion = await Publicacion.findByPk(id_publicacion);
        const id_usuario_dueño = publicacion.id_usuario;
        await Notificacion.create({ tipo_evento: 'Interés', motivo: motivo, id_causante: id_usuario_interesado, id_dueño: id_usuario_dueño, id_publicacion: id_publicacion });

        res.redirect(`/publicacion/ver/${id_publicacion}`);
    } catch (error) { next(error); }
}

async function guardar(req, res, next) {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.userId;
        const nombreLista = req.body.nombreLista;

        if (isNaN(Number(id_publicacion)) || !nombreLista) { res.status(400).json({ error: 'Datos inválidos' }); }

        await Favorito.create({ nombre: nombreLista, id_publicacion: id_publicacion, id_usuario: id_usuario });
        res.redirect(`/publicacion/ver/${id_publicacion}`);
    } catch (error) { next(error); }
}

async function actualizarValoracion(req, res, next) {
    try {
        const id_imagen = req.params.id;
        const { valoracion } = req.body;
        if (isNaN(Number(id_imagen)) || valoracion === undefined) return res.status(400).json({ error: 'Datos inválidos' });

        await Valoracion.create({ valoracion: valoracion, id_imagen: id_imagen, id_usuario: req.session.userId });

        const imagen = await Imagen.findByPk(id_imagen, { include: [Valoracion] });
        const datosPlanos = imagen.toJSON();
        const valoraciones = datosPlanos.Valoracions || [];
        const valoracionesPositivas = valoraciones.filter(v => v.valoracion === true);
        const promedio = valoraciones.length > 0 ? valoracionesPositivas.length / valoraciones.length * 100 : 0;
        datosPlanos.promedio = promedio;
        
        res.json({ promedio: Math.round(promedio), cantidad: valoraciones.length });
    } catch (error) { next(error); }
}

async function buscarPorEtiqueta(req, res, next) {
    try {
        const nombre = req.params.nombre;
        if (!nombre) return res.status(400).json({ error: 'Datos inválidos' });

        const usuario = await Usuario.findByPk(req.session.userId);
        const publicaciones = await Publicacion.findAll({
            limit: 10,
            include: [
                { model: Imagen, include: [{ model: Valoracion }, { model: Comentario, include: [{ model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }] }] },
                { model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }, { model: Etiqueta, where: { nombre: nombre } }
            ]
        });

        const datos = publicaciones.map(pub => {
            const publicacionJSON = pub.toJSON();

            publicacionJSON.Imagens = publicacionJSON.Imagens.map(imagen => {
                const valoraciones = imagen.Valoracions || [];
                const valoracionesPositivas = valoraciones.filter(v => v.valoracion === true);
                const promedio = valoraciones.length > 0 ? (valoracionesPositivas.length / valoraciones.length) * 100 : 0;
                return { ...imagen, cantidad: valoraciones.length, promedio: Math.round(promedio) };
            });

            return publicacionJSON;
        });
        
        res.render('index', { publicaciones: datos, usuario });
    } catch (error) { next(error); }
}

async function ver(req, res, next) {
    try {
        const id = req.params.id;
        if (isNaN(Number(id))) return res.status(400).json({ error: 'Datos inválidos' });

        const usuario = await Usuario.findByPk(req.session.userId);
        const publicacion = await Publicacion.findByPk(id, {
            include: [
                { model: Imagen, include: [{ model: Valoracion }, { model: Comentario, include: [{ model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }] }] },
                { model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }, { model: Etiqueta }
            ]
        });
        if (!publicacion) return res.status(404).render('error', { error: new Error('Publicación no encontrada') });

        const datosPlanos = publicacion.toJSON();
        datosPlanos.Imagens = datosPlanos.Imagens.map(imagen => {
            const valoraciones = imagen.Valoracions || [];
            const valoracionesPositivas = valoraciones.filter(v => v.valoracion === true);
            const promedio = valoraciones.length > 0 ? (valoracionesPositivas.length / valoraciones.length) * 100 : 0;
            return { ...imagen, cantidad: valoraciones.length, promedio: Math.round(promedio) };
        });

        res.render('index', { publicaciones: [datosPlanos], usuario });
    } catch (error) { next(error); }
}

module.exports = {
    crear,
    modificar,
    modificarEtiqueta,
    eliminarEtiqueta,
    eliminarImagen,
    eliminar,
    denunciar,
    marcarInteres,
    guardar,
    actualizarValoracion,
    buscarPorEtiqueta,
    ver
}