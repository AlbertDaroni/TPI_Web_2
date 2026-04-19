const db = require('../config/db');
const controlador = require('./controlador');

/* REGISTRARSE ------------------------------------------------------------------------------------------------------------ */
async function registrar(req, res, next) {
    try {
        const { nombre, email, contraseña } = req.body;

        const [filas] = (await db.query(`
            INSERT INTO usuarios (nombre, foto_perfil, email, contraseña, fecha_creacion, descripcion)
            VALUES (?, null, ?, ?, NOW(), null)`, [nombre, email, contraseña]
        ));

        req.session.userId = filas.insertId;
        res.redirect('/');
    } catch (error) {
        if (error.errno === 1062) return res.render('registro', { error: 'Nombre en uso' });
        next(error);
    }
}

/* INGRESAR --------------------------------------------------------------------------------------------------------------- */
async function ingresar(req, res, next) {
    try {
        const { nombre, email, contraseña } = req.body;
        const [filas] = (await db.query('SELECT id, nombre, email, contraseña FROM usuarios WHERE nombre = ? AND email = ? AND contraseña = ?',
            [nombre, email, contraseña]));
        
        if (filas.length > 0) {
            req.session.userId = filas[0].id;
            res.redirect('/');
        } else { res.render('ingreso', { error: 'Credenciales inválidas'}); }
    } catch (error) { next(error); }
}

/* MODIFICAR USUARIO ------------------------------------------------------------------------------------------------------ */
async function modificar(req, res, next) {
    try {
        const id = req.session.userId;
        if (req.method === 'GET') {
            const [filas] = await db.query('SELECT * FROM usuarios WHERE id = ?', id);
            res.render('modificar', { usuario: filas[0] });
        } else {
            const { nombre, email, contraseña, descripcion } = req.body;
            const [usuarioActual] = await db.query('SELECT foto_perfil FROM usuarios WHERE id = ?', [id]);
            const foto_perfil = req.file ? `/uploads/${req.file.filename}` : usuarioActual[0].foto_perfil;

            await db.query(`UPDATE usuarios SET foto_perfil = ?, nombre = ?, email = ?, contraseña = ?, descripcion = ? WHERE id = ?`,
                [foto_perfil, nombre, email, contraseña, descripcion, id]
            );

            res.redirect(`/perfil/usuario/${id}`);
        }
    } catch (error) {
        if (error.errno === 1062) return res.render('modificar', { error: 'Nombre en uso' });
        next(error);
    }
}

/* PERFIL ----------------------------------------------------------------------------------------------------------------- */
async function perfil(req, res, next) {
    try {
        const id_perfil = req.params.id;
        const id_registrado = req.session.userId;
        const esMiPerfil = id_perfil == id_registrado;

        const [filas] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id_perfil]);
        const publicaciones = await controlador.obtenerDatosGeneralesPublicacion("usuario", null, id_perfil, null);
        const [loSigo] = await db.query('SELECT * FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?', [id_registrado, id_perfil]);
        const [[seguidos_Cantidad]] = await db.query('SELECT COUNT(*) AS Total FROM seguidores WHERE id_seguidor = ?', [id_perfil]);
        const [[seguidores_Cantidad]] = await db.query('SELECT COUNT(*) AS Total FROM seguidores WHERE id_seguido = ?', [id_perfil]);

        let publicaciones_Seguidos = [];
        let publicaciones_Favoritas = [];

        if (esMiPerfil) {
            const [filas] = await db.query('SELECT id_seguido FROM seguidores WHERE id_seguidor = ?', [id_registrado]);
            const ID_Seguidos = filas.map(fila => fila.id_seguido);

            if (ID_Seguidos.length > 0) publicaciones_Seguidos = await controlador.obtenerDatosGeneralesPublicacion("varios_usuarios", null, ID_Seguidos);
            publicaciones_Favoritas = await controlador.obtenerDatosGeneralesPublicacion("favoritas", '', id_registrado);
        }

        res.render('perfil', {
            usuario: filas[0],
            publicaciones: publicaciones,
            seguidos: seguidos_Cantidad.Total,
            seguidores: seguidores_Cantidad.Total,
            publicaciones_Seguidos: publicaciones_Seguidos,
            publicaciones_Favoritas: publicaciones_Favoritas,
            loSigo: loSigo.length > 0,
            esMiPerfil,
            id: id_registrado
        });
    } catch (error) { next(error); }
}

/* VER SEGUIDOS ----------------------------------------------------------------------------------------------------------- */
async function seguidos(req, res, next) {
    try {
        const [filas] = await db.query('SELECT seguidos FROM usuarios WHERE id = ?', [req.params.id]);
        res.render('seguidos_seguidores', { seguidos: filas, usuario: req.params.id });
    } catch (error) { next(error); }
}

/* VER SEGUIDORES --------------------------------------------------------------------------------------------------------- */
async function seguidores(req, res, next) {
    try {
        const [filas] = await db.query('SELECT seguidores FROM usuarios WHERE id = ?', [req.params.id]);
        res.render('seguidos_seguidores', { seguidores: filas, usuario: req.params.id });
    } catch (error) { next(error); }
}

/* SEGUIR / DEJAR DE SEGUIR ----------------------------------------------------------------------------------------------- */
async function alternarSeguimiento(req, res, next) {
    try {
        const id_seguidor = req.session.userId;
        const id_seguido = req.params.id;

        const [existe] = await db.query('SELECT * FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?', [id_seguidor, id_seguido]);

        if (existe.length > 0 ) {
            await db.query('DELETE FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?', [id_seguidor, id_seguido]);
        } else {
            await db.query('INSERT INTO seguidores(id_seguidor, id_seguido) VALUES(?, ?)', [id_seguidor, id_seguido]);
        }

        res.redirect(`/perfil/usuario/${id_seguido}`);
    } catch (error) { next(error); }
}

/* NOTIFICACIONES --------------------------------------------------------------------------------------------------------- */
async function notificaciones(req, res, next) {
    try {
        const id = req.session.userId;
        const [notificaciones] = await db.query('SELECT * FROM notificaciones WHERE id_usuario = ?', [id]);

        res.render('notificaciones', { notificaciones, id });
    } catch (error) { next(); }
}

module.exports = {
    registrar,
    ingresar,
    modificar,
    perfil,
    seguidores,
    seguidos,
    alternarSeguimiento,
    notificaciones
};