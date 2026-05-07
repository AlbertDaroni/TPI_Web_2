const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../config/middlewares');
const controlador = require('../controladores/controlador');
const Likes = require('../models/Likes');

/* Rutas protegidas -> Todas las rutas siguientes requerirán sesión activa */
router.use(protegerRuta);

/* Cerrar sesión */
router.get('/cerrar-sesion', (req, res) => { req.session.destroy(() => res.redirect('/usuario/registrarse')); });

/* Página principal */
router.get('/', controlador.contenidoPaginaPrincipal);

/* Actualizar Likes */
router.post('/publicacion/:id/like', async (req, res, next) => {
    try {
        const resultado = await Likes.actualizarLikes(req.session.userId, req.params.id);
        res.json({ likes: resultado.totalLikes });
    } catch (error) { next(error); }
});

/* Buscar un usuario o publicación */
// router.get('/buscar', controlador.buscar);

module.exports = router;