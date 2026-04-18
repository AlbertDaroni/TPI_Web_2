const db = require('../config/db');
const controlador = require('./controlador');

/* REGISTRARSE ------------------------------------------------------------------------------------------------------------ */
async function registrar(req, res, next) {
    try {
        const { nombre, email, contraseña } = req.body;

        const [filas] = (await db.query(`
            INSERT INTO usuarios (nombre, foto_perfil, email, contraseña, fecha_creacion, descripcion, cantidad_seguidores, cantidad_seguidos, seguidores, seguidos)
            VALUES (?, null, ?, ?, NOW(), null, 0, 0, null, null)`, [nombre, email, contraseña]
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

/* BUSCAR UN USUARIO ------------------------------------------------------------------------------------------------------ */
async function buscar(req, res, next) {
    try {
        const nombre = req.query.nombre;
        const [usuario] = await db.query('SELECT id FROM usuarios WHERE nombre = ?', [nombre]);

        if (usuario.length > 0) {
            res.redirect(`/perfil/usuario/${usuario[0].id}`);
        } else {
            res.redirect('/').send('No se ha encontrado ningún usuario con ese nombre');
        }
    } catch (error) { next(); }
}

/* PERFIL ----------------------------------------------------------------------------------------------------------------- */
async function perfil(req, res, next) {
    try {
        const id_seguido = req.params.id;
        const id_seguidor = req.session.userId;

        const [filas] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id_seguido]);
        const [publicaciones] = await controlador.obtenerDatosGeneralesPublicacion("usuario", null, id_seguido, null);
        const [verificacion] = await db.query('SELECT * FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?', [id_seguidor, id_seguido]);
        const [[seguidos]] = await db.query('SELECT COUNT(*) FROM seguidores WHERE id_seguidor = ?', [id_seguido]);
        const [[seguidores]] = await db.query('SELECT COUNT(*) FROM seguidores WHERE id_seguido = ?', [id_seguido]);

        res.render('perfil', {
            usuario: filas[0],
            publicaciones: publicaciones,
            seguidos: seguidos,
            seguidores: seguidores,
            loSigo: verificacion.length > 0,
            esMiPerfil: id_seguidor == id_seguido,
            id: id_seguidor
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
async function alternarSeguimiento() {
    try {
        const id_seguidor = req.session.userId;
        const id_seguido = req.params.id;

        const [existe] = await db.query('SELECT * FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?', [id_seguidor, id_seguido]);

        if (existe.length > 0 ) {
            await db.query('DELETE FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?', [id_seguidor, id_seguido]);
        } else {
            await db.query('INSERT INTO seguidores(id_seguidor, id_seguido) VALUES(?, ?)', [id_seguidor, id_seguido]);
        }

        res.redirect(`/perfil/${id_seguido}`);
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
    buscar,
    perfil,
    seguidores,
    seguidos,
    alternarSeguimiento,
    notificaciones
};