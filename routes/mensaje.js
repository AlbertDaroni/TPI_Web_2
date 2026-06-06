const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../config/middlewares');
const mensaje = require('../controladores/mensaje');

router.use(protegerRuta);

/* Obtener */
router.get('/chats', mensaje.obtener)

/* Obtener chat */
router.post('/chat', mensaje.obtenerChat);

/* Crear */
router.put('/crear', mensaje.crear);

/* Modificar */
router.put('/modificar', mensaje.modificar);

/* Eliminar  */
router.delete('/eliminar', mensaje.eliminar);

module.exports = router;