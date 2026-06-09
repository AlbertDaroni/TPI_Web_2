const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../config/middlewares');
const imagen = require('../controladores/imagen');

router.use(protegerRuta);

/* Denunciar */
router.get('/denunciar/:id', imagen.denunciar);
router.post('/denunciar', imagen.denunciar);

/* Eliminar */
router.get('/eliminar/:id', imagen.eliminar);

/* Alternar comentarios */
router.post('/alternar', imagen.alternarComentarios);

/* Actualizar valoración */
router.put('/valoracion', imagen.actualizarValoracion);

module.exports = router;