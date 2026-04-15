const express = require('express');
const router = express.Router();
const controlador = require('../controller/controller');

/* Página principal */
router.get('/', controlador.contenidoPaginaPrincipal);

/* Página de Registro */
router.get('/registrarse', (req, res) => { res.render('registro'); });
router.post('/registrarse', controlador.registrarUsuario);

/* Validar */
router.post('/validar/:id', controlador.validarUsuario);

/* Ver publicación */
router.get('/publicacion/:id', controlador.verPublicacion);

/* Actualizar Likes */
router.post('/publicacion/like/:id', controlador.actualizarLikes);

/* Perfil */
router.get('/perfil/:id', controlador.perfil);

/* Denunciar publicación */
router.get('/publicacion/denunciar/:id', (req, res) => { res.render('denuncia', { id_publicacion: req.params.id }); });
router.post('/publicacion/denunciar/:id', controlador.denunciarPublicacion);

/* Denunciar comentario */
router.get('/comentario/denunciar/:id', (req, res) => { res.render('denuncia', { id_comentario: req.params.id }); });
router.post('/comentario/denunciar/:id', controlador.denunciarComentario);

/* Crear publicación */
router.get('/publicacion/agregar', (req, res) => { res.render('agregar'); });
router.post('/publicacion/insertar', controlador.crearPublicacion);

/* Eliminar publicación */
router.post('/publicacion/eliminar/:id', controlador.eliminarPublicacion);

/* Crear comentario */
router.post('/publicacion/:id/comentario/agregar', controlador.agregarComentario);

/* Modificar comentario */
router.post('/publicacion/:id_publicacion/comentario/modificar/:id_comentario', controlador.modificarComentario);

/* Eliminar comentario */
router.post('/publicacion/:id_publicacion/comentario/eliminar/:id_comentario', controlador.eliminarComentario);

module.exports = router;