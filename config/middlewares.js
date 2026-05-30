const path = require('path');
const multer = require('multer');
const { Usuario } = require('../models/index');

/* MIDDLEWARE de verificador de sesión */
const protegerRuta = async (req, res, next) => {
    const usuario = await Usuario.findByPk(req.session.userId);
    if (usuario) { res.locals.userIdSesion = req.session.userId; }
    else { res.redirect('/'); }
    next();
};

/* Guardador de imágenes */
const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

module.exports = { protegerRuta, upload };