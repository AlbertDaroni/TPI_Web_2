const express = require('express');
const router = express.Router();
const controlador = require('../controller/controller');

/* MIDDLEWARE de verificador de sesión */
const protegerRuta = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/ingresar');
    next();
};

/* Página de Registro */
router.get('/registrarse', (req, res) => { res.render('registro'); });
router.post('/registrarse', controlador.registrarUsuario);

/* Ingresar */
router.get('/ingresar', (req, res) => { res.render('ingreso'); });
router.post('/ingresar', controlador.ingresar);

/* Rutas protegidas -> Todas las rutas siguientes requerirán sesión activa */
router.use(protegerRuta);

/* Cerrar sesión */
router.get('/cerrar-sesion', (req, res) => { req.session.destroy(() => res.redirect('/registrarse')); });

/* Página principal */
router.get('/', controlador.contenidoPaginaPrincipal);

/* Ver publicación */
router.get('/publicacion/:id', controlador.verPublicacion);

/* Actualizar Likes */
router.post('/publicacion/like/:id', controlador.actualizarLikes);

/* Perfil */
router.get('/perfil/usuario/:id', controlador.perfil);

/* Denunciar publicación */
router.get('/publicacion/denunciar/:id', (req, res) => { res.render('denuncia', { id_publicacion: req.params.id }); });
router.post('/publicacion/denunciar/:id', controlador.denunciarPublicacion);

/* Denunciar comentario */
router.get('/comentario/denunciar/:id', (req, res) => { res.render('denuncia', { id_comentario: req.params.id }); });
router.post('/comentario/denunciar/:id', controlador.denunciarComentario);

/* Crear publicación */
router.get('/publicacion/agregar', (req, res) => { res.render('agregar'); });
router.post('/publicacion/agregar', controlador.crearPublicacion);

/* Eliminar publicación */
router.post('/publicacion/eliminar/:id', controlador.eliminarPublicacion);

/* Crear comentario */
router.post('/publicacion/:id/comentario/agregar', controlador.agregarComentario);

/* Modificar comentario */
router.post('/publicacion/:id_publicacion/comentario/modificar/:id_comentario', controlador.modificarComentario);

/* Eliminar comentario */
router.post('/publicacion/:id_publicacion/comentario/eliminar/:id_comentario', controlador.eliminarComentario);

module.exports = router;