const sequelize = require('../config/db');
const { Imagen, Usuario, Etiqueta, Validador, Notificacion, Comentario, Valoracion, Publicacion } = require('../models/index');
const { Op } = require('sequelize');

async function contenidoPaginaPrincipal(req, res, next) {
    try {
        const usuario = await Usuario.findByPk(req.session.userId) || null;
        const tieneDenuncias = await controlDeDenuncias(usuario);

        const idsCargados = req.body && req.body.idsCargados ? req.body.idsCargados : [];
        const publicaciones = await Publicacion.findAll({
            where: { id: { [Op.notIn]: idsCargados } },
            order: sequelize.random(), limit: 10,
            include: [
                { model: Etiqueta }, { model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] },
                { model: Imagen, 
                    include: [
                        { model: Valoracion }, 
                        { model: Comentario, include: [{ model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }]}
                    ]
                }
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
            if (datos.length === 0) return res.status(200).json({ html: '', publicaciones: [], finalizar: true });

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
        
        const publicaciones = await Publicacion.findAll({ where: { id_usuario: usuario.id } });
        const imagenes = await Imagen.findAll({ where: { id_publicacion: { [Op.in]: publicaciones.map(p => p.id) } } });
        const comentarios = await Comentario.findAll({ where: { id_usuario: usuario.id } });
        const denunciasImgs = await Notificacion.findAll({ where: { tipo_evento: 'Denuncia', id_imagen: { [Op.in]: imagenes.map(i => i.id) }, notificada: false } });
        const denunciasComs = await Notificacion.findAll({ where: { tipo_evento: 'Denuncia', id_comentario: { [Op.in]: comentarios.map(c => c.id) }, notificada: false } });

        for (const d of denunciasImgs) { await d.update({ notificada: true }); }
        for (const d of denunciasComs) { await d.update({ notificada: true }); }

        const cantImagenes = imagenes.filter(i => denunciasImgs.id_imagen === i.id && denunciasImgs.id_imagen >= 3);
        for (const imagen of cantImagenes) {
            const publicacion = await Publicacion.findByPk(imagen.id_publicacion);
            await Validador.create({ id_publicacion: publicacion.id });
        }

        return denunciasImgs.length > 0 || denunciasComs.length > 0;
    } catch (error) { console.error(error); }
}

async function controlDeContenido(req, res, next) {
    try {
        
    } catch (error) { next(error); }
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

module.exports = { contenidoPaginaPrincipal, controlDeContenido, buscar };