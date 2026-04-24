const db = require('../config/db');

/* CREAR PUBLICACIÓN ------------------------------------------------------------------------------------------------------ */
async function crearPublicacion(req, res, next) {
    try {
        const id = req.session.userId;
        if (req.method === 'GET') {
            res.render('agregar', { id });
        } else {
            const { titulo, descripcion, licencia, etiquetas } = req.body;

            if (titulo.trim() === '' || descripcion.trim() === '') { res.render('agregar', { error: 'Campos incompletos' }); }
    
            const [result] = await db.query(`
                INSERT INTO publicaciones (titulo, descripcion, likes, fecha, denuncias, id_usuario)
                VALUES (?, ?, 0, NOW(), 0, ?)`, [titulo, descripcion, id]
            );
    
            const id_publicacion = result.insertId;

            if (req.files && req.files.length > 0) {
                for (const imagen of req.files) {
                    const ruta = `/uploads/${imagen.filename}`;
                    await db.query(`
                        INSERT INTO imagenes (imagen, licencia, id_publicacion)
                        VALUES (?, ?, ?)`, [ruta, licencia, id_publicacion]
                    );
                }
            } else { res.render('agregar', { error: 'Campos incompletos' }); }
    
            if (etiquetas) {
                for(let etiqueta of etiquetas) {
                    if (etiqueta.trim() !== "") {
                        etiqueta = `#${etiqueta}`;
                        await db.query(`INSERT INTO etiquetas (titulo, id_publicacion)
                        VALUES (?, ?)`, [etiqueta, id_publicacion]);
                    } else { res.render('agregar', { error: 'Campos incompletos' }); }
                }
            }
    
            res.redirect('/');
        }
    } catch (error) { next(error); }
}

/* CREAR COMENTARIO ------------------------------------------------------------------------------------------------------- */
async function agregarComentario(req, res, next) {
    try {
        const comentario = req.body.comentario;
        const id_publicacion = req.params.id;
        const id = req.session.userId;
        
        if (comentario.trim() === '' || isNaN(Number(id_publicacion))) { return res.status(400).json({ error: 'Texto vacío' }); }

        await db.query(`
            INSERT INTO comentarios (comentario, fecha, id_publicacion, id_usuario)
            VALUES (?, NOW(), ?, ?)`, [comentario, id_publicacion, id]
        );

        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

/* MODIFICAR COMENTARIO */
async function modificarComentario(req, res, next) {
    try {
        const { id_publicacion, id_comentario} = req.params;
        const comentario = req.body.comentario;

        if (comentario.trim() === '' || isNaN(Number(id_publicacion)) || isNaN(Number(id_comentario))) { return res.status(400).json({ error: 'Datos inválidos' }); }

        await db.query('UPDATE comentarios SET comentario = ? WHERE id = ?', [comentario, id_comentario]);
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

/* DENUNCIAR PUBLICACIÓN -------------------------------------------------------------------------------------------------- */
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
            
            await db.query(`
                INSERT INTO denuncias (descripcion, fecha, id_publicacion, id_comentario)
                VALUES (?, NOW(), ?, null)`, [descripcion, id_publicacion]
            );
    
            await db.query('UPDATE publicaciones SET denuncias = denuncias + 1 WHERE id = ?', [id_publicacion]);
            
            const [usuarioDueño] = await db.query('SELECT id FROM usuarios WHERE id = (SELECT id_usuario FROM publicaciones WHERE id = ?)', [id_publicacion]);

            await db.query(`
                INSERT INTO notificaciones(tipo_evento, motivo, fecha, vista, id_causante, id_dueño, id_publicacion)
                VALUES("Denuncia", ?, NOW(), 0, ?, ?, ?)`, [descripcion, id_dueño, usuarioDueño[0].id, id_publicacion]
            );
            
            res.redirect(`/#pub-${id_publicacion}`);
        }
    } catch (error) { next(error); }
}

/* DENUNCIAR COMENTARIO --------------------------------------------------------------------------------------------------- */
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

            await db.query(`
                INSERT INTO denuncias (descripcion, fecha, id_publicacion, id_comentario)
                VALUES (?, NOW(), null, ?)`, [descripcion, id_comentario]
            );
    
            await db.query('UPDATE comentarios SET denuncias = denuncias + 1 WHERE id = ?', [id_comentario]);

            const [usuarioDueño] = await db.query('SELECT id FROM usuarios WHERE id = (SELECT id_usuario FROM comentarios WHERE id = ?)', [id_comentario]);

            await db.query(`
                INSERT INTO notificaciones(tipo_evento, motivo, fecha, vista, id_causante, id_dueño, id_publicacion)
                VALUES("Denuncia", ?, NOW(), 0, ?, ?, null)`, [descripcion, id_dueño, usuarioDueño[0].id]
            );
    
            const [[id_publicacion]] = await db.query('SELECT id FROM publicaciones WHERE id = (SELECT id_usuario FROM comentarios WHERE id = ?)', [id_comentario]);

            res.redirect(`/#pub-${id_publicacion.id}`);
        }
    } catch (error) { next(error); }
}

/* ELIMINAR PUBLICACIÓN --------------------------------------------------------------------------------------------------- */
async function eliminarPublicacion(req, res, next) {
    try {
        const id_publicacion = Number(req.params.id);
        const id_usuario = req.session.userId;

        if (isNaN(Number(id_publicacion))) { return res.status(400).json({ error: 'Dato inválido' }); }

        await db.query('DELETE FROM imagenes WHERE id_publicacion = ?', [id_publicacion]);
        await db.query('DELETE FROM comentarios WHERE id_publicacion = ?', [id_publicacion]);
        await db.query('DELETE FROM etiquetas WHERE id_publicacion = ?', [id_publicacion]);
        await db.query('DELETE FROM publicaciones WHERE id = ?', [id_publicacion]);

        res.redirect(`/usuario/${id_usuario}/perfil`);
    } catch (error) { next(error); }
}

/* ELIMINAR COMENTARIO ---------------------------------------------------------------------------------------------------- */
async function eliminarComentario(req, res, next) {
    try {
        const id_comentario = Number(req.params.id_comentario);
        const id_publicacion = Number(req.params.id_publicacion);

        if (isNaN(id_comentario) || isNaN(id_publicacion)) { res.status(400).json({ error: 'Datos inválidos' }); }

        await db.query('DELETE FROM comentarios WHERE id = ?', [id_comentario]);
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

/* MARCAR INTERÉS --------------------------------------------------------------------------------------------------------- */
async function marcarInteres(req, res, next) {
    try {
        const id_publicacion = Number(req.params.id);
        const id_usuario_interesado = req.session.userId;
        const motivoInteres = req.body.motivoInteres;

        if (isNaN(id_publicacion) || motivoInteres.trim() === '') { res.status(400).json({ error: 'Datos inválidos' }); }
        
        const [dueño] = await db.query('SELECT id_usuario FROM publicaciones WHERE id = ?', [id_publicacion]);
        const id_usuario_dueño = dueño[0].id_usuario;

        await db.query(`INSERT INTO notificaciones(tipo_evento, motivo, fecha, vista, id_causante, id_dueño, id_publicacion)
            VALUES("Interes", ?, NOW(), 0, ?, ?, ?)`, [motivoInteres, id_usuario_interesado, id_usuario_dueño, id_publicacion]);

        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(); }
}

/* GUARDAR PUBLICACIÓN ---------------------------------------------------------------------------------------------------- */
async function guardarPublicacion(req, res, next) {
    try {
        const id_publicacion = Number(req.params.id);
        const id_usuario = req.session.userId;
        const nombreLista = Number(req.body.nombreLista);

        if (isNaN(id_publicacion) || nombreLista.trim() === '') { res.status(400).json({ error: 'Datos inválidos' }); }

        await db.query(`INSERT INTO favoritos(nombre, id_publicacion, id_usuario)
            VALUES(?, ?, ?)`, [nombreLista, id_publicacion, id_usuario]);

        res.redirect(`/#pub-${id_publicacion}`).send('Guardado con éxito');
    } catch (error) { next(); }
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