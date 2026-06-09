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

/* Modificar */
router.put('/modificar', publicacion.modificar);

/* Eliminar publicación */
router.post('/eliminar/:id', publicacion.eliminar);

/* Marcar interés */
router.post('/:id/marcarInteres', publicacion.marcarInteres);

/* Guardar */
router.post('/:id/guardar', publicacion.guardar);

module.exports = router;