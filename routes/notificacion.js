const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../config/middlewares');
const notificacion = require('../controladores/notificacion');

router.use(protegerRuta);

/* Notificaciones */
router.get('/', notificacion.obtener);

/* Filtrar */
router.post('/filtrar', notificacion.filtrar);

/* Eliminar */
router.get('/eliminar', notificacion.eliminar);

/* Actualizar visto */
router.put('/actualizarVisto', notificacion.actualizarVisto);

module.exports = router;