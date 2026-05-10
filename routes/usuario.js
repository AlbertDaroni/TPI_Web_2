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

/* Modificar perfil */
router.get('/modificar', usuario.modificar);
router.post('/modificar', upload.single('imagen'), usuario.modificar);

/* Chats */
router.get('/chats', usuario.chats);

/* Notificaciones */
router.get('/notificaciones', usuario.notificaciones);

/* Eliminar notificaciones */
router.get('/notificaciones/eliminar', usuario.eliminarNotificaciones);

/* Seguir / Dejar de seguir */
router.post('/perfil/seguir/:id', usuario.alternarSeguimiento);

/* Actualizar visto */
router.post('/notificaciones/:id/actualizarVisto', usuario.actualizarVisto);

/* Perfil */
router.get('/:id/perfil', usuario.perfil);

/* Ver seguidos */
router.get('/:id/seguidos', usuario.seguidos);

/* Ver seguidores */
router.get('/:id/seguidores', usuario.seguidores);

module.exports = router;