const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controlador = require('../controladores/controlador');
const publicacion = require('../controladores/publicacion');
const usuario = require('../controladores/usuario');

/* MIDDLEWARE de verificador de sesión */
const protegerRuta = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/ingresar');
    next();
};

/* MIDDLEWARE para reconocer el usuario en todas las vistas */
router.use((req, res, next) => {
    res.locals.userIdSesion = req.session.userId; 
    next();
});

/* Guardador de imágenes */
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* Página de Registro */
router.get('/registrarse', (req, res) => { res.render('registro'); });
router.post('/registrarse', usuario.registrar);

/* Ingresar */
router.get('/ingresar', (req, res) => { res.render('ingreso'); });
router.post('/ingresar', usuario.ingresar);

/* Rutas protegidas -> Todas las rutas siguientes requerirán sesión activa */
router.use(protegerRuta);

/* Cerrar sesión */
router.get('/cerrar-sesion', (req, res) => { req.session.destroy(() => res.redirect('/registrarse')); });

/* Página principal */
router.get('/', controlador.contenidoPaginaPrincipal);

/* Actualizar Likes */
router.post('/publicacion/:id/like', controlador.actualizarLikes);

/* Perfil */
router.get('/perfil/usuario/:id', usuario.perfil);

/* Modificar perfil */
router.get('/usuario/modificar', usuario.modificar);
router.post('/usuario/modificar', upload.single('imagen'), usuario.modificar);

/* Denunciar publicación */
router.get('/publicacion/:id/denunciar', (req, res) => { res.render('denuncia', { id_publicacion: req.params.id }); });
router.post('/publicacion/:id/denunciar', publicacion.denunciarPublicacion);

/* Denunciar comentario */
router.get('/comentario/denunciar/:id', (req, res) => { res.render('denuncia', { id_comentario: req.params.id }); });
router.post('/comentario/denunciar/:id', publicacion.denunciarComentario);

/* Crear publicación */
router.get('/publicacion/agregar', publicacion.crearPublicacion);
router.post('/publicacion/agregar', upload.single('imagen'), publicacion.crearPublicacion);

/* Eliminar publicación */
router.post('/publicacion/eliminar/:id', publicacion.eliminarPublicacion);

/* Crear comentario */
router.post('/publicacion/:id/comentario/agregar', publicacion.agregarComentario);

/* Modificar comentario */
router.post('/publicacion/:id_publicacion/comentario/modificar/:id_comentario', publicacion.modificarComentario);

/* Eliminar comentario */
router.post('/publicacion/:id_publicacion/comentario/eliminar/:id_comentario', publicacion.eliminarComentario);

/* Ver seguidos */
router.get('/usuario/:id/seguidos', usuario.seguidos);

/* Ver seguidores */
router.get('/usuario/:id/seguidores', usuario.seguidores);

/* Seguir / Dejar de seguir */
router.post('/perfil/seguir/:id', usuario.alternarSeguimiento);

/* Notificaciones */
router.get('/notificaciones', usuario.notificaciones);

/* Buscar un usuario */
router.get('/buscar', usuario.buscar);

module.exports = router;