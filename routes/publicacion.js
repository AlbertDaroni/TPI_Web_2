const express = require('express');
const router = express.Router();
const { protegerRuta, upload } = require('../config/middlewares');
const publicacion = require('../controladores/publicacion');

router.use(protegerRuta);

/* Denunciar publicación */
router.get('/:id/denunciar', publicacion.denunciarPublicacion);
router.post('/:id/denunciar', publicacion.denunciarPublicacion);

/* Denunciar comentario */
router.get('/comentario/:id/denunciar', publicacion.denunciarComentario);
router.post('/comentario/:id/denunciar', publicacion.denunciarComentario);

/* Crear publicación */
router.get('/agregar', publicacion.crearPublicacion);
router.post('/agregar', upload.array('imagenes', 5), publicacion.crearPublicacion);

/* Eliminar publicación */
router.post('/:id/eliminar', publicacion.eliminarPublicacion);

/* Crear comentario */
router.post('/:id/comentario/agregar', publicacion.agregarComentario);

/* Modificar comentario */
router.post('/:id_publicacion/comentario/:id_comentario/modificar', publicacion.modificarComentario);

/* Eliminar comentario */
router.post('/:id_publicacion/comentario/:id_comentario/eliminar', publicacion.eliminarComentario);

/* Marcar interés */
router.post('/:id/marcarInteres', publicacion.marcarInteres);

/* Guardar publicación */
router.post('/:id/guardar', publicacion.guardarPublicacion);

module.exports = router;