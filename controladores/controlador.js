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
        const nombre = req.query.nombre;
        if (!nombre) return res.status(404).send('Datos inválidos');
        const usuarios = await Usuario.findAll({ where: { nombre: { [Op.iLike]: `%${nombre}%` } } });
        const publicaciones = await Publicacion.findAll({ where: { titulo: { [Op.iLike]: `%${nombre}%` } }, include: [{ model: Imagen }] });
        res.render('buscar', { usuarios, publicaciones, nombre });
    } catch (error) { next(); }
}

module.exports = { contenidoPaginaPrincipal, buscar };