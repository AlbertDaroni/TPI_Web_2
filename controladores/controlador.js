const sequelize = require('../config/db');
const { Imagen, Usuario, Denuncia, Etiqueta, Validador, Comentario, Valoracion, Publicacion, Notificacion } = require('../models/index');
const { Op } = require('sequelize');

async function contenidoPaginaPrincipal(req, res, next) {
    try {
        const esValido = await controlDeDenuncias(req, next);
        if (!esValido) { res.render('notificaciones'); }

        const usuario = await Usuario.findByPk(req.session.userId) || null;
        const idsCargados = req.body && req.body.idsCargados ? req.body.idsCargados : [];
        const publicaciones = await Publicacion.findAll({
            where: { id: { [Op.notIn]: idsCargados } },
            order: sequelize.random(), limit: 10,
            include: [
                { model: Imagen }, { model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }, { model: Etiqueta }, { model: Valoracion },
                { model: Comentario, include: [{ model: Usuario, attributes: ['id', 'nombre', 'foto_perfil'] }] }
            ]
        });

        const datos = publicaciones.map(pub => {
            const valoracionesPositivas = pub.Valoracions.filter(v => v.valoracion === true);
            const promedio = pub.Valoracions.length > 0 ? valoracionesPositivas.length / pub.Valoracions.length  * 100 : 0;
            return { ...pub.toJSON(), promedio: Math.round(promedio) };
        });
        
        if (req.method === 'POST') {
            if (datos.length === 0) return res.status(200).json({ html: '', datosNuevos: [], finalizar: true });

            let htmlAcumulado = '';
            for (const pub of datos) {
                await new Promise((resolve, reject) => {
                    res.render('index_pub', { dato: pub, usuario }, (err, html) => {
                        if (err) return reject(err);
                        htmlAcumulado += html;
                        resolve();
                    });
                });
            }
            
            return res.json({ html: htmlAcumulado, datosNuevos: datos, finalizar: false });
        }

        res.render('index', { datos, usuario });
    } catch (error) { next(error); }
}

async function controlDeDenuncias(req, next) {
    try {
        if (!req.session.userId) return true;
        
        let pasa = true;
        const id_usuario = req.session.userId;
        const publicaciones = await Publicacion.findAll({ where: { id_usuario: id_usuario, denuncias: { [Op.gt]: 2 } } });
        const comentarios = await Comentario.findAll({ where: { id_usuario: id_usuario, denuncias: { [Op.gt]: 2 } } });
        
        if (publicaciones.length > 0) { for (const pub of publicaciones) { await Validador.create({ id_publicacion: pub.id }); } pasa = false; }
        if (comentarios.length > 0) pasa = false;
        
        const ids_publicacion = publicaciones.map(pub => pub.id);
        const ids_comentario = comentarios.map(com => com.id);
        const denunciasPubs = await Denuncia.findAll({ where: { id_publicacion: { [Op.in]: ids_publicacion }, notificada: false } });
        const denunciasComs = await Denuncia.findAll({ where: { id_comentario: { [Op.in]: ids_comentario }, notificada: false } });

        for (const d of denunciasPubs) {
            await Notificacion.create({
                tipo_evento: 'Denuncia', motivo: d.motivo, id_dueno: id_usuario,
                id_causante: d.id_usuario, id_publicacion: d.id_publicacion
            });
            await d.update({ notificada: true });
        }
        for (const d of denunciasComs) {
            await Notificacion.create({
                tipo_evento: 'Denuncia', motivo: d.motivo, id_dueno: id_usuario,
                id_causante: d.id_usuario, id_comentario: d.id_comentario
            });
            await d.update({ notificada: true });
        }

        return pasa;
    } catch (error) { next(error); }
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