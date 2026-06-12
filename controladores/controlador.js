const sequelize = require('../config/db');
const { Imagen, Usuario, Etiqueta, Validador, Notificacion, Comentario, Valoracion, Publicacion } = require('../models/index');
const { Op } = require('sequelize');

async function contenidoPaginaPrincipal(req, res, next) {
    try {
        const usuario = await Usuario.findByPk(req.session.userId, { attributes: ['id', 'nombre', 'foto_perfil'] }) || null;
        const tieneDenuncias = await controlDeDenuncias(usuario);

        const idsCargados = req.body && req.body.idsCargados ? req.body.idsCargados : [];
        const publicacionesDisponibles = await Publicacion.findAll({ where: { id: { [Op.notIn]: idsCargados } }, attributes: ['id'], order: sequelize.random(), limit: 3, raw: true });

        if (publicacionesDisponibles.length === 0) {
            if (req.method === 'POST') return res.status(200).json({ html: '', publicaciones: [], finalizar: true });
            return res.render('index', { publicaciones: [], usuario, tieneDenuncias });
        }

        const idsPublicaciones = publicacionesDisponibles.map(p => p.id);
        const publicaciones = await Publicacion.findAll({
            where: { id: { [Op.in]: idsPublicaciones } },
            include: [
                { model: Etiqueta, attributes: ['id', 'nombre'] }, { model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] },
                { model: Imagen, include: [
                    { model: Valoracion, attributes: ['id', 'valoracion'] },
                    { model: Comentario, include: [
                        { model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] },
                        { model: Notificacion, attributes: ['id'], where: { tipo_evento: 'Denuncia' }, required: false }
                    ]}
                ]}
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
        
        if (req.method === 'POST') {
            let htmlAcumulado = '';
            for (const pub of datos) {
                await new Promise((resolve, reject) => {
                    res.render('index_pub', { pub: pub, usuario }, (err, html) => {
                        if (err) return reject(err);
                        htmlAcumulado += html;
                        resolve();
                    });
                });
            }
            
            return res.json({ html: htmlAcumulado, publicaciones: datos, finalizar: false });
        }

        res.render('index', { publicaciones: datos, usuario, tieneDenuncias });
    } catch (error) { next(error); }
}

async function controlDeDenuncias(usuario) {
    try {
        if (!usuario) return false;
        
        const [comentarios, publicaciones] = await Promise.all([
            Comentario.findAll({ where: { id_usuario: usuario.id }, attributes: ['id'], raw: true }),
            Publicacion.findAll({ where: { id_usuario: usuario.id }, attributes: ['id'], raw: true })
        ]);

        const idsPublicaciones = publicaciones.map(p => p.id);
        const idsComentarios = comentarios.map(c => c.id);

        if (idsPublicaciones.length === 0 && idsComentarios.length === 0) return false;
        const imagenes = idsPublicaciones.length > 0
        ? await Imagen.findAll({ where: { id_publicacion: { [Op.in]: idsPublicaciones } }, attributes: ['id', 'id_publicacion'], raw: true })
        : [];
        
        const idsImagenes = imagenes.map(i => i.id);
        
        const [denunciasComs, denunciasImgs] = await Promise.all([
            idsComentarios.length > 0 ? Notificacion.findAll({
                where: { tipo_evento: 'Denuncia', id_comentario: { [Op.in]: idsComentarios }, vista: false },
                attributes: ['id'],
                raw: true
            }) : [],
            idsImagenes.length > 0 ? Notificacion.findAll({
                where: { tipo_evento: 'Denuncia', id_imagen: { [Op.in]: idsImagenes }, vista: false },
                attributes: ['id_imagen', 'id_causante'],
                raw: true
            }) : []
        ]);
        
        if (denunciasComs.length === 0 && denunciasImgs.length === 0) return false;
        
        const mapaDenunciasUnicas = new Map();
        denunciasImgs.forEach(d => {
            const id_imagen = d.id_imagen;
            const id_causante = d.id_causante;

            if (!mapaDenunciasUnicas.has(id_imagen)) mapaDenunciasUnicas.set(id_imagen, new Set());
            mapaDenunciasUnicas.get(id_imagen).add(id_causante);
        });

        const idsImagenesCriticas = [];
        for (const [id_imagen, usuarios] of mapaDenunciasUnicas.entries()) {
            if (usuarios.size >= 3) idsImagenesCriticas.push(id_imagen);
        }

        const cantImagenes = imagenes.filter(i => idsImagenesCriticas.includes(i.id));
        if (cantImagenes.length > 0) {
            const idsPubsCriticas = [...new Set(cantImagenes.map(i => i.id_publicacion))];
            for (const pubId of idsPubsCriticas) {
                const existe = await Validador.findOne({ where: { id_publicacion: pubId }, attributes: ['id'], raw: true });
                if (!existe) { await Validador.create({ id_publicacion: pubId }); }
                else { await Publicacion.update({ modificable: false }, { where: { id: pubId } }); }

                const totalPubsBajadas = await Validador.count({ where: { id_publicacion: { [Op.in]: idsPublicaciones } } });
                if (totalPubsBajadas >= 3) await usuario.update({ registrado: false });
            }
        }

        return denunciasImgs.length > 0 || denunciasComs.length > 0;
    } catch (error) { console.error(error); }
}

async function buscar(req, res, next) {
    try {
        let usuarios = [], publicaciones = [];

        if (req.method === "GET") {
            const [publicacionesAleatorias, usuariosAleatorios] = await Promise.all([
                Publicacion.findAll({ limit: 30, attributes: ['id'], order: sequelize.random(), raw: true }),
                Usuario.findAll({ limit: 20, attributes: ['id'], order: sequelize.random(), raw: true })
            ]);

            const idsPublicaciones = publicacionesAleatorias.map(p => p.id);
            const idsUsuarios = usuariosAleatorios.map(u => u.id);
    
            const [pubsCompletas, usrsCompletos] = await Promise.all([
                Publicacion.findAll({
                    where: { id: { [Op.in]: idsPublicaciones } }, attributes: ['id', 'titulo'],
                    include: [{ model: Imagen, attributes: ['id', 'imagen'] }]
                }),
                Usuario.findAll({
                    where: { id: { [Op.in]: idsUsuarios } },
                    attributes: ['id', 'nombre', 'foto_perfil']
                })
            ]);

            return res.render('buscar', { usuarios: usrsCompletos, publicaciones: pubsCompletas });
        }
        
        const {
            buscarPorNombre, buscarPorTitulo, buscarPorReciente,
            buscarPorAntiguo, buscarPorPopulares, buscarPorImpopulares,
            buscarPorEtiqueta, nombre, titulo, etiquetas
        } = req.body;
        
        let condicionesUsrs = {}, condicionesPubs = {};
        let includePubs = [{ model: Imagen, attributes: ['id', 'imagen'], include: [{ model: Valoracion }] }];
        let ordenUsrs = [['createdAt', 'DESC']], ordenPubs = [['createdAt', 'DESC']];
        
        if (buscarPorNombre && nombre) condicionesUsrs.nombre = { [Op.iLike]: `%${nombre.trim()}%` };
        if (buscarPorTitulo && titulo) condicionesPubs.titulo = { [Op.iLike]: `%${titulo.trim()}%` };
        if (buscarPorReciente) { ordenUsrs = [['createdAt', 'DESC']]; ordenPubs = [['createdAt', 'DESC']]; }
        if (buscarPorAntiguo) { ordenUsrs = [['createdAt', 'ASC']]; ordenPubs = [['createdAt', 'ASC']]; }
        if (buscarPorEtiqueta && etiquetas && etiquetas.length > 0) {
            const listaEtiquetas = etiquetas.map(e => e.startsWith('#') ? e.split('#')[1].toLowerCase().trim() : e.toLowerCase().trim());
            includePubs.push({ model: Etiqueta, where: { nombre: { [Op.in]: listaEtiquetas } }, attributes: ['nombre'], required: true });
        }
        
        [usuarios, publicaciones] = await Promise.all([
            Usuario.findAll({
                where: condicionesUsrs,
                attributes: ['id', 'nombre', 'foto_perfil', 'createdAt'],
                order: ordenUsrs
            }),
            Publicacion.findAll({
                where: condicionesPubs,
                attributes: ['id', 'titulo', 'createdAt'],
                include: includePubs,
                order: ordenPubs,
                limit: 20
            })
        ]);
        
        let listaPublicaciones = publicaciones.map(p => p.toJSON());
        if (buscarPorPopulares || buscarPorImpopulares) {
            listaPublicaciones.forEach(pub => {
                let totalLikes = 0;
                pub.Imagens.forEach(img => {
                    const valoraciones = img.Valoracions || [];
                    const valoracionesPositivas = valoraciones.filter(v => v.valoracion === true);
                    totalLikes += valoracionesPositivas.length;
                });
                pub.totalLikesCalculados = totalLikes;
            });
            
            if (buscarPorPopulares) listaPublicaciones.sort((a, b) => b.totalLikesCalculados - a.totalLikesCalculados);
            if (buscarPorImpopulares) listaPublicaciones.sort((a, b) => a.totalLikesCalculados - b.totalLikesCalculados);
        }

        res.render('buscar', { usuarios, publicaciones: listaPublicaciones });
    } catch (error) { next(error); }
}

module.exports = { contenidoPaginaPrincipal, buscar }