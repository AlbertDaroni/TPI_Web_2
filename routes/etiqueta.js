const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../config/middlewares');
const etiqueta = require('../controladores/etiqueta');

router.use(protegerRuta);

/* Eliminar */
router.delete('/eliminar', etiqueta.eliminar);

module.exports = router;