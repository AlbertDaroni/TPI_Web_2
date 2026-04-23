const express = require('express');
const router = express.Router();
const { protegerRuta, upload } = require('../config/middlewares');
const publicacion = require('../controladores/publicacion');

router.use(protegerRuta);

/* Denunciar publicación */
router.get('/:id/denunciar', (req, res) => { res.render('denuncia', { id_publicacion: req.params.id }); });
router.post('/:id/denunciar', publicacion.denunciarPublicacion);

/* Denunciar comentario */
router.get('/comentario/denunciar/:id', (req, res) => { res.render('denuncia', { id_comentario: req.params.id }); });
router.post('/comentario/denunciar/:id', publicacion.denunciarComentario);

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
router.post('/:id_publicacion/marcarInteres', publicacion.marcarInteres);

/* Guardar publicación */
router.post('/:id_publicacion/:id_usuario/guardar', publicacion.guardarPublicacion);

module.exports = router;