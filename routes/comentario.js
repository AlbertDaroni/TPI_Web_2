const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../config/middlewares');
const comentario = require('../controladores/comentario');

router.use(protegerRuta);

/* Crear */
router.post('/crear', comentario.crear);

/* Modificar */
router.put('/modificar', comentario.modificar);

/* Denunciar */
router.get('/denunciar/:id', comentario.denunciar);
router.post('/denunciar', comentario.denunciar);

/* Alternar */
router.post('/alternar', comentario.alternar);

/* Eliminar */
router.delete('/eliminar', comentario.eliminar);

module.exports = router;