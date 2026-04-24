const db = require('../config/db');
const controlador = require('./controlador');

/* REGISTRARSE ------------------------------------------------------------------------------------------------------------ */
async function registrar(req, res, next) {
    try {
        const { nombre, email, contraseña } = req.body;

        if (nombre.trim() === '' || email.trim() === '' || contraseña.trim() === '') {
            res.render('registro', { error: 'Todos los campos son obligatorios' });
        }

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

        if (nombre.trim() === '' || email.trim() === '' || contraseña.trim() === '') {
            res.render('ingreso', { error: 'Todos los campos son obligatorios' });
        }

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

            if (nombre.trim() === '' || email.trim() === '' || contraseña.trim() === '') {
                res.render('modificar', { error: 'Todos los campos son obligatorios' });
            }

            await db.query(`UPDATE usuarios SET foto_perfil = ?, nombre = ?, email = ?, contraseña = ?, descripcion = ? WHERE id = ?`,
                [foto_perfil, nombre, email, contraseña, descripcion, id]
            );

            res.redirect(`/usuario/${id}/perfil`);
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

        if (isNaN(Number(id_perfil))) { return res.status(400).json({ error: 'Dato inválido' }); }

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
        const [filas] = await db.query(`
            SELECT u.id, u.nombre, u.foto_perfil 
            FROM usuarios u
            JOIN seguidores s ON u.id = s.id_seguido
            WHERE s.id_seguidor = ?`, [req.params.id]
        );
        res.render('seguidos-seguidores', { tipo: "seguidos", lista: filas, id_perfil: req.params.id });
    } catch (error) { next(error); }
}

/* VER SEGUIDORES --------------------------------------------------------------------------------------------------------- */
async function seguidores(req, res, next) {
    try {
        const [filas] = await db.query(`
            SELECT u.id, u.nombre, u.foto_perfil 
            FROM usuarios u
            JOIN seguidores s ON u.id = s.id_seguidor
            WHERE s.id_seguido = ?`, [req.params.id]
        );
        res.render('seguidos-seguidores', { tipo: "seguidores", lista: filas, usuario: req.params.id });
    } catch (error) { next(error); }
}

/* SEGUIR / DEJAR DE SEGUIR ----------------------------------------------------------------------------------------------- */
async function alternarSeguimiento(req, res, next) {
    try {
        const id_seguidor = req.session.userId;
        const id_seguido = req.params.id;

        if (isNaN(Number(id_seguido))) { return res.status(400).json({ error: 'Dato inválido' }); }

        const [existe] = await db.query('SELECT * FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?', [id_seguidor, id_seguido]);

        if (existe.length > 0 ) {
            await db.query('DELETE FROM seguidores WHERE id_seguidor = ? AND id_seguido = ?', [id_seguidor, id_seguido]);
            await db.query(`INSERT INTO notificaciones (tipo_evento, fecha, vista, id_causante, id_dueño, id_publicacion)
                VALUES ('Dejó de seguirte', NOW(), 0, ?, ?, NULL)`, [id_seguido, id_seguidor]);
        } else {
            await db.query('INSERT INTO seguidores(id_seguidor, id_seguido) VALUES(?, ?)', [id_seguidor, id_seguido]);
            await db.query(`INSERT INTO notificaciones (tipo_evento, fecha, vista, id_causante, id_dueño, id_publicacion)
                VALUES ('Nuevo seguidor', NOW(), 0, ?, ?, NULL)`, [id_seguido, id_seguidor]);
        }

        res.redirect(`/usuario/${id_seguido}/perfil`);
    } catch (error) { next(error); }
}

/* NOTIFICACIONES --------------------------------------------------------------------------------------------------------- */
async function notificaciones(req, res, next) {
    try {
        const id = req.session.userId;
        const [filas] = await db.query(`
            SELECT n.*, u.nombre, u.foto_perfil, p.titulo
            FROM notificaciones n
            JOIN usuarios u ON n.id_causante = u.id
            LEFT JOIN publicaciones p ON n.id_publicacion = p.id
            WHERE id_dueño = ?
            ORDER BY fecha DESC`, [id]
        );

        res.render('notificaciones', { notificaciones: filas });
    } catch (error) { next(); }
}

/* ACTUALIZAR EL VISTO ---------------------------------------------------------------------------------------------------- */
async function actualizarVisto(req, res, next) {
    try {
        const id_notificacion = req.params.id;

        if (isNaN(Number(id_notificacion))) { return res.status(400).json({ error: 'Dato inválido' }); }

        const [[notificacion]] = await db.query('SELECT vista FROM notificaciones WHERE id = ?', [id_notificacion]);
        if (notificacion.vista === 0) await db.query('UPDATE notificaciones SET vista = 1 WHERE id = ?', [id_notificacion]);
        res.json({ vista: notificacion.vista });
    } catch (error) { next(error); }
}

module.exports = {
    registrar,
    ingresar,
    modificar,
    perfil,
    seguidores,
    seguidos,
    alternarSeguimiento,
    notificaciones,
    actualizarVisto
};