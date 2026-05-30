const express = require('express');
const router = express.Router();
const { protegerRuta, upload } = require('../config/middlewares');
const usuario = require('../controladores/usuario');

/* Registrarse */
router.get('/registrarse', (req, res) => { res.render('registro'); });
router.post('/registrarse', usuario.registrar);

/* Ingresar */
router.get('/ingresar', (req, res) => { res.render('ingreso'); });
router.post('/ingresar', usuario.ingresar);

router.use(protegerRuta);

/* Modificar perfil */
router.get('/modificar', usuario.modificar);
router.post('/modificar', upload.single('imagen'), usuario.modificar);

/* Seguir / Dejar de seguir */
router.post('/perfil/seguir/:id', usuario.alternarSeguimiento);

/* Perfil */
router.get('/:id/perfil', usuario.perfil);

/* Ver seguidos */
router.get('/:id/seguidos', usuario.seguidos);

/* Ver seguidores */
router.get('/:id/seguidores', usuario.seguidores);

module.exports = router;