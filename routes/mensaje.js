const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../config/middlewares');
const mensaje = require('../controladores/mensaje');

router.use(protegerRuta);

/* Obtener */
router.get('/chats', mensaje.obtener)

/* Crear */
router.put('/crear', mensaje.crear);

/* Modificar */
router.put('/:id/modificar', mensaje.modificar);

/* Eliminar  */
router.delete('/:id/eliminar', mensaje.eliminar);

module.exports = router;