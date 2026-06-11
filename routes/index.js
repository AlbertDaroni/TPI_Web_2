const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../config/middlewares');
const controlador = require('../controladores/controlador');

/* Cerrar sesión */
router.get('/cerrar-sesion', (req, res) => { req.session.destroy(() => res.redirect('/usuario/registrarse')); });

/* Página principal */
router.get('/', controlador.contenidoPaginaPrincipal);
router.post('/', controlador.contenidoPaginaPrincipal);

router.use(protegerRuta);

/* Buscar */
router.get('/buscar', controlador.buscar);
router.post('/buscar', controlador.buscar);

module.exports = router;