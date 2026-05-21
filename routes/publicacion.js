const express = require('express');
const router = express.Router();
const { protegerRuta, upload } = require('../config/middlewares');
const publicacion = require('../controladores/publicacion');
const comentario = require('../controladores/comentario');

router.use(protegerRuta);

/* Crear publicación */
router.get('/agregar', publicacion.crear);
router.post('/agregar', upload.array('imagenes', 5), publicacion.crear);

/* Denunciar comentario */
router.get('/comentario/:id/denunciar', comentario.denunciar);
router.post('/comentario/:id/denunciar', comentario.denunciar);

/* Buscar por etiqueta */
router.get('/etiqueta/:nombre', publicacion.buscarPorEtiqueta);

/* Ver publicación */
router.get('/ver/:id', publicacion.ver);

/* Denunciar publicación */
router.get('/:id/denunciar', publicacion.denunciar);
router.post('/:id/denunciar', publicacion.denunciar);

/* Eliminar publicación */
router.post('/:id/eliminar', publicacion.eliminar);

/* Crear comentario */
router.post('/:id/comentario/agregar', comentario.crear);

/* Modificar comentario */
router.post('/:id_publicacion/comentario/:id_comentario/modificar', comentario.modificar);

/* Eliminar comentario */
router.post('/:id_publicacion/comentario/:id_comentario/eliminar', comentario.eliminar);

/* Marcar interés */
router.post('/:id/marcarInteres', publicacion.marcarInteres);

/* Guardar publicación */
router.post('/:id/guardar', publicacion.guardar);

/* Actualizar valoración */
router.put('/:id/valoracion', publicacion.actualizarValoracion);

module.exports = router;