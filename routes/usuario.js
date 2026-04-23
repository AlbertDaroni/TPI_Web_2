const express = require('express');
const router = express.Router();
const { protegerRuta, upload } = require('../config/middlewares');
const usuario = require('../controladores/usuario');

/* Página de Registro */
router.get('/registrarse', (req, res) => { res.render('registro'); });
router.post('/registrarse', usuario.registrar);

/* Ingresar */
router.get('/ingresar', (req, res) => { res.render('ingreso'); });
router.post('/ingresar', usuario.ingresar);

router.use(protegerRuta);

/* Perfil */
router.get('/:id/perfil', usuario.perfil);

/* Modificar perfil */
router.get('/modificar', usuario.modificar);
router.post('/modificar', upload.single('imagen'), usuario.modificar);

/* Ver seguidos */
router.get('/:id/seguidos', usuario.seguidos);

/* Ver seguidores */
router.get('/:id/seguidores', usuario.seguidores);

/* Seguir / Dejar de seguir */
router.post('/perfil/seguir/:id', usuario.alternarSeguimiento);

/* Notificaciones */
router.get('/notificaciones', usuario.notificaciones);

/* Actualizar visto */
router.post('/notificaciones/:id/actualizarVisto', usuario.actualizarVisto);

module.exports = router;