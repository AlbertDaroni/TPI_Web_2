const db = require('../config/db');

/* CREAR PUBLICACIÓN ------------------------------------------------------------------------------------------------------ */
async function crearPublicacion(req, res, next) {
    try {
        const id = req.session.userId;
        if (req.method === 'GET') {
            res.render('agregar', { id });
        } else {
            const { titulo, descripcion, licencia, usuarios, etiquetados } = req.body;
            const imagen = req.file ? `/uploads/${req.file.filename}`: '/images/sin_imagen.png';
    
            const [result] = await db.query(`
                INSERT INTO publicaciones (titulo, descripcion, likes, fecha, denuncias, id_usuario)
                VALUES (?, ?, 0, NOW(), 0, ?)`, [titulo, descripcion, id]
            );
    
            const id_publicacion = result.insertId;
            await db.query(`INSERT INTO imagenes (imagen, licencia, id_publicacion)
            VALUES (?, ?, ?)`, [imagen, licencia, id_publicacion]);
    
            const [id_usuarios] = await db.query('SELECT id FROM usuarios WHERE id IN (?)', [etiquetados]);
    
            if (etiquetados) {
                for(const usuario of id_usuarios) {
                    await db.query(`INSERT INTO etiquetas (id_publicacion, id_usuario)
                    VALUES (?, ?)`, [id_publicacion, usuario.id]);
                }
            }
    
            res.redirect('/');
        }
    } catch (error) { next(error); }
}

/* CREAR COMENTARIO ------------------------------------------------------------------------------------------------------- */
async function agregarComentario(req, res, next) {
    try {
        const { comentario, id_usuario } = req.body;
        const id_publicacion = req.params.id;
        
        await db.query(`
            INSERT INTO comentarios (comentario, fecha, id_publicacion, id_usuario)
            VALUES (?, NOW(), ?, ?)`, [comentario, id_publicacion, id_usuario]);

        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

/* MODIFICAR COMENTARIO */
async function modificarComentario(req, res, next) {
    try {
        const { id_publicacion, id_comentario} = req.params;
        const comentario = req.body.comentario;
        await db.query('UPDATE comentarios SET comentario = ? WHERE id = ?', [comentario, id_comentario]);
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

/* DENUNCIAR PUBLICACIÓN -------------------------------------------------------------------------------------------------- */
async function denunciarPublicacion(req, res, next) {
    try {
        const { descripcion, id_publicacion } = req.body;
        
        await db.query(`
            INSERT INTO denuncias (descripcion, fecha, id_publicacion, id_comentario)
            VALUES (?, NOW(), ?, null)`, [descripcion, id_publicacion]
        );

        await db.query('UPDATE publicaciones SET denuncias = denuncias + 1 WHERE id = ?', [id_publicacion]);
        
        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

/* DENUNCIAR COMENTARIO --------------------------------------------------------------------------------------------------- */
async function denunciarComentario(req, res, next) {
    try {
        const { descripcion, id_publicacion, id_comentario } = req.body;

        await db.query(`
            INSERT INTO denuncias (descripcion, fecha, id_publicacion, id_comentario)
            VALUES (?, NOW(), null, ?)`, [descripcion, id_comentario]
        );

        await db.query('UPDATE comentarios SET denuncias = denuncias + 1 WHERE id = ?', [id_comentario]);

        res.redirect(`/#pub-${id_publicacion}`);
    } catch (error) { next(error); }
}

/* ELIMINAR PUBLICACIÓN --------------------------------------------------------------------------------------------------- */
async function eliminarPublicacion(req, res, next) {
    try {
        await db.query('DELETE FROM imagenes WHERE id_publicacion = ?', [req.params.id]);
        await db.query('DELETE FROM comentarios WHERE id_publicacion = ?', [req.params.id]);
        await db.query('DELETE FROM etiquetas WHERE id_publicacion = ?', [req.params.id]);
        await db.query('DELETE FROM publicaciones WHERE id = ?', [req.params.id]);

        res.redirect(`/perfil/${req.body.id_usuario}`);
    } catch (error) { next(error); }
}

/* ELIMINAR COMENTARIO ---------------------------------------------------------------------------------------------------- */
async function eliminarComentario(req, res, next) {
    try {
        await db.query('DELETE FROM comentarios WHERE id = ?', [req.params.id_comentario]);
        res.redirect(`/#pub-${req.params.id_publicacion}`);
    } catch (error) { next(error); }
}

module.exports = {
    crearPublicacion,
    agregarComentario,
    modificarComentario,
    denunciarPublicacion,
    denunciarComentario,
    eliminarPublicacion,
    eliminarComentario
};