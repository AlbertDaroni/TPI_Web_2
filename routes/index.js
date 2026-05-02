const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../config/middlewares');
const controlador = require('../controladores/controlador');
const likes = require('../models/likes');

/* Rutas protegidas -> Todas las rutas siguientes requerirán sesión activa */
router.use(protegerRuta);

/* Cerrar sesión */
router.get('/cerrar-sesion', (req, res) => { req.session.destroy(() => res.redirect('/usuario/registrarse')); });

/* Página principal */
router.get('/', controlador.contenidoPaginaPrincipal);

/* Actualizar Likes */
router.post('/publicacion/:id/like', likes.actualizarLikes);

/* Buscar un usuario o publicación */
// router.get('/buscar', controlador.buscar);

module.exports = router;