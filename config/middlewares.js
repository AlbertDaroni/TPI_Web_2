const multer = require('multer');
const path = require('path');

/* MIDDLEWARE de verificador de sesión */
const protegerRuta = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/usuario/ingresar');
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