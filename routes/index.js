const express = require('express');
const router = express.Router();
const controlador = require('../controladores/controlador');

/* Cerrar sesión */
router.get('/cerrar-sesion', (req, res) => { req.session.destroy(() => res.redirect('/usuario/registrarse')); });

/* Página principal */
router.get('/', controlador.contenidoPaginaPrincipal);
router.post('/', controlador.contenidoPaginaPrincipal);

/* Buscar un usuario o publicación */
router.get('/buscar', controlador.buscar);

module.exports = router;