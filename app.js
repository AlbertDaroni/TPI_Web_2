const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sesion = require('express-session');

const indexRouter = require('./routes/index');
const usuariosRouter = require('./routes/usuario');
const publicacionesRouter = require('./routes/publicacion');

const sequelize = require('./config/db');
const Comentario = require('./models/Comentario');
const Denuncia = require('./models/Denuncia');
const Etiqueta = require('./models/Etiqueta');
const Favorito = require('./models/Favorito');
const Imagen = require('./models/Imagen');
const Likes = require('./models/Likes');
const Mensaje = require('./models/Mensaje');
const Notificacion = require('./models/Notificacion');
const Publicacion = require('./models/Publicacion');
const Usuario = require('./models/Usuario');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sesion({
  secret: 'mi-clave-secreta-de-usuario',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: false
  }
}));

/* MIDDLEWARE para reconocer el usuario en todas las vistas */
app.use((req, res, next) => {
    res.locals.userIdSesion = req.session.userId; 
    next();
});

app.use('/usuario', usuariosRouter);
app.use('/publicacion', publicacionesRouter);
app.use('/', indexRouter);

// Atrapar un Error 404 y seguir al Manejador de Error
app.use((req, res, next) => { next(createError(404)); });

// Manejador de error
app.use((err, req, res, next) => {
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err);
  res.status(err.status || 500).render('error');
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados con la base de datos')

    const puerto = 3000;
    app.listen(puerto, () => console.log(`Servidor corriendo en http://localhost:${puerto}`));
  })
  .catch(error => console.error('Error al sincronizarse con la base de datos:', error));

module.exports = app;