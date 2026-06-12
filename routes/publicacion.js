const express = require('express');
const router = express.Router();
const { protegerRuta, upload } = require('../config/middlewares');
const publicacion = require('../controladores/publicacion');

router.use(protegerRuta);

/* Crear */
router.get('/crear', publicacion.crear);
// router.post('/crear', upload.array('imagenes', 5), publicacion.crear);
router.post('/crear', publicacion.crear);

/* Buscar por etiqueta */
router.get('/etiqueta/:nombre', publicacion.buscarPorEtiqueta);

/* Ver */
router.get('/ver/:id', publicacion.ver);

/* Modificar */
router.put('/modificar', publicacion.modificar);

/* Eliminar */
router.delete('/eliminar', publicacion.eliminar);

/* Marcar interés */
router.post('/marcarInteres', publicacion.marcarInteres);

/* Guardar */
router.post('/guardar', publicacion.guardar);

module.exports = router;