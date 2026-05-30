const express = require('express');
const router = express.Router();
const { protegerRuta, upload } = require('../config/middlewares');
const publicacion = require('../controladores/publicacion');

router.use(protegerRuta);

/* Crear */
router.get('/crear', publicacion.crear);
router.post('/crear', upload.array('imagenes', 5), publicacion.crear);

/* Buscar por etiqueta */
router.get('/etiqueta/:nombre', publicacion.buscarPorEtiqueta);

/* Ver */
router.get('/ver/:id', publicacion.ver);

/* Denunciar */
router.get('/:id/denunciar', publicacion.denunciar);
router.post('/denunciar', publicacion.denunciar);

/* Eliminar */
router.post('/:id/eliminar', publicacion.eliminar);

/* Marcar interés */
router.post('/:id/marcarInteres', publicacion.marcarInteres);

/* Guardar */
router.post('/:id/guardar', publicacion.guardar);

/* Actualizar valoración */
router.put('/:id/valoracion', publicacion.actualizarValoracion);

module.exports = router;