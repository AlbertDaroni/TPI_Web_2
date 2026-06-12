const { Imagen, Usuario, Etiqueta, Favorito, Comentario, Valoracion, Publicacion, Notificacion } = require('../models/index');

async function crear(req, res, next) {
    try {
        const id = req.session.userId;
        if (req.method === 'GET') return res.render('agregar', { id });

        const { titulo, descripcion, licencias, marcasDeAgua, etiquetas, imagenes } = req.body;

        if (!titulo || !imagenes || etiquetas.length === 0 || imagenes.length === 0) { res.render('agregar', { error: 'Campos incompletos' }); }
        for (const licencia of licencias) { if (licencia === undefined) { res.render('agregar', { error: 'Campos incompletos' }); } }
        for (const etiqueta of etiquetas) { if (!etiqueta) { res.render('agregar', { error: 'Campos incompletos' }); } }
            
        const nuevaPublicacion = await Publicacion.create({ titulo: titulo, descripcion: descripcion, id_usuario: id });
        const nuevasImagenes = imagenes.map((imgBase64, indice) => {
            const conLicencia = licencias[indice] === 'true';
            const conMarca = marcasDeAgua && marcasDeAgua[indice] === 'true';

            return Imagen.create({ 
                imagen: imgBase64, // Guarda la cadena comprimida ultra liviana directamente en la base de datos
                licencia: conLicencia, 
                marcaDeAgua: conMarca ? 'Marca de agua' : null, 
                id_publicacion: nuevaPublicacion.id 
            });
        });
        /* const nuevasImagenes = req.files.map((imagen, indice) => {
            return Imagen.create({ imagen: stringBase64, licencia: licencias[indice], marcaDeAgua: marcasDeAgua[indice], id_publicacion: nuevaPublicacion.id });
        }); */
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
        
        await Publicacion.update({ titulo: titulo, descripcion: descripcion }, { where: { id: id } });
        if (etiquetas && etiquetas.length > 0 && idsEtiquetas && idsEtiquetas.length > 0) {
            for (let i = 0; i < etiquetas.length; i++) {
                const id_etiqueta = parseInt(idsEtiquetas[i]);
                if (id_etiqueta) { await Etiqueta.update({ nombre: etiquetas[i] }, { where: { id: id_etiqueta } }); }
                else { await Etiqueta.create({ nombre: etiquetas[i], id_publicacion: id }); }
            }
        }

        res.json({ titulo: titulo, descripcion: descripcion, etiquetas: etiquetas });
    } catch (error) { next(error); }
}

async function eliminar(req, res, next) {
    try {
        const id_usuario = req.session.userId;
        const { id } = req.body;

        if (isNaN(Number(id))) return res.status(400).render('error', { error: new Error('Datos inválidos') });
        await Publicacion.destroy({ where: { id: id } });

        res.redirect(`/usuario/${id_usuario}/perfil`);
    } catch (error) { next(error); }
}

async function marcarInteres(req, res, next) {
    try {
        const { id, usuario } = req.body;

        if (isNaN(Number(id)) || isNaN(Number(usuario))) { res.status(400).json({ error: 'Datos inválidos' }); }
        
        const interesado = await Usuario.findByPk(req.session.userId);
        const dueño = await Usuario.findByPk(usuario);
        const loSigo = await interesado.hasSeguidos(dueño);

        if (!loSigo) await interesado.addSeguidos(dueño);
        await Notificacion.create({
            tipo_evento: 'Interés',
            id_causante: req.session.userId,
            id_dueño: usuario,
            id_publicacion: id
        });

        res.redirect('/mensaje/chats');
    } catch (error) { next(error); }
}

async function guardar(req, res, next) {
    try {
        const id_usuario = req.session.userId;
        const { id: id_publicacion, nombre } = req.body;

        if (isNaN(Number(id_publicacion)) || !nombre) { res.status(400).json({ error: 'Datos inválidos' }); }

        const existe = await Favorito.findOne({ where: { nombre: nombre, id_publicacion: id_publicacion, id_usuario: id_usuario } });
        if (!existe) await Favorito.create({ nombre: nombre, id_publicacion: id_publicacion, id_usuario: id_usuario });
        res.json({ ok: true });
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
    eliminar,
    marcarInteres,
    guardar,
    buscarPorEtiqueta,
    ver
}