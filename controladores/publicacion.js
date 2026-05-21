const { Imagen, Usuario, Etiqueta, Denuncia, Favorito, Comentario, Valoracion, Publicacion, Notificacion } = require('../models/index');

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
        await Notificacion.create({ tipo_evento: 'Denuncia', motivo: motivo, id_causante: id_dueño, id_dueno: publicacion.id_usuario, id_publicacion: id_publicacion });
            
        res.redirect(`/#pub-${id_publicacion}`);
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

        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

async function guardar(req, res, next) {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.userId;
        const nombreLista = req.body.nombreLista;

        if (isNaN(Number(id_publicacion)) || !nombreLista) { res.status(400).json({ error: 'Datos inválidos' }); }

        await Favorito.create({ nombre: nombreLista, id_publicacion: id_publicacion, id_usuario: id_usuario });
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

async function actualizarValoracion(req, res, next) {
    try {
        const id = req.params.id;
        const { valoracion } = req.body;
        if (isNaN(Number(id)) || valoracion === undefined) return res.status(400).json({ error: 'Datos inválidos' });

        await Valoracion.create({ valoracion: valoracion, id_publicacion: id });

        const publicacion = await Publicacion.findByPk(id, { include: [Valoracion] });
        const datosPlanos = publicacion.toJSON();
        const valoraciones = datosPlanos.Valoracions || [];
        const valoracionesPositivas = valoraciones.filter(v => v.valoracion === true);
        const promedio = valoraciones.length > 0 ? valoracionesPositivas.length / valoraciones.length * 100 : 0;
        datosPlanos.promedio = promedio;
        
        res.json({ promedio: Math.round(promedio) });
    } catch (error) { next(error); }
}

async function buscarPorEtiqueta(req, res, next) {
    try {
        const nombre = req.params.nombre;
        if (!nombre) return res.status(400).json({ error: 'Datos inválidos' });

        const usuario = await Usuario.findByPk(req.session.userId);
        const publicaciones = await Publicacion.findAll({
            limit: 50,
            include: [
                { model: Imagen }, { model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }, { model: Etiqueta, where: { nombre: nombre } }, 
                { model: Valoracion }, { model: Comentario, include: [{ model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }] }
            ]
        });

        const datos = publicaciones.map(pub => {
            const valoracionesPositivas = pub.Valoracions.filter(v => v.valoracion === true);
            const promedio = pub.Valoracions.length > 0 ? valoracionesPositivas.length / pub.Valoracions.length  * 100 : 0;
            return { ...pub.toJSON(), promedio: Math.round(promedio) };
        });
        
        res.render('index', { datos, usuario });
    } catch (error) { next(error); }
}

async function ver(req, res, next) {
    try {
        const id = req.params.id;
        if (isNaN(Number(id))) return res.status(400).json({ error: 'Datos inválidos' });

        const usuario = await Usuario.findByPk(req.session.userId);
        const publicacion = await Publicacion.findByPk(id, {
            include: [
                { model: Imagen }, { model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }, { model: Etiqueta },
                { model: Valoracion }, { model: Comentario, include: [{ model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }] }
            ]
        });
        if (!publicacion) return res.status(404).render('error', { error: new Error('Publicación no encontrada') });

        const datosPlanos = publicacion.toJSON();
        const valoraciones = datosPlanos.Valoracions || [];
        const valoracionesPositivas = valoraciones.filter(v => v.valoracion === true);
        const promedio = valoraciones.length > 0 ? valoracionesPositivas.length / valoraciones.length * 100 : 0;
        datosPlanos.promedio = Math.round(promedio);

        res.render('index', { datos: [datosPlanos], usuario, ver: true });
    } catch (error) { next(error); }
}

module.exports = {
    crear,
    modificar,
    eliminar,
    denunciar,
    marcarInteres,
    guardar,
    actualizarValoracion,
    buscarPorEtiqueta,
    ver
}