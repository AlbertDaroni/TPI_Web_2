require('dotenv').config();
const path = require('path');
const logger = require('morgan');
const express = require('express');
const sequelize = require('./config/db');
const sesion = require('express-session');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
const imagenRouter = require('./routes/imagen');
const mensajesRouter = require('./routes/mensaje');
const usuariosRouter = require('./routes/usuario');
const etiquetaRouter = require('./routes/etiqueta');
const comentariosRouter = require('./routes/comentario');
const publicacionesRouter = require('./routes/publicacion');
const notificacionesRouter = require('./routes/notificacion');

const { Imagen, Mensaje, Usuario, Etiqueta, Favorito, Validador, Comentario, Valoracion, Publicacion, Notificacion } = require('./models');

const app = express();

app.set('trust proxy', 1);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const SequelizeStore = require('connect-session-sequelize')(sesion.Store);
const almacenSesiones = new SequelizeStore({ db: sequelize });

almacenSesiones.sync();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sesion({
  secret: process.env.SESSION_SECRET,
  store: almacenSesiones,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: false,
    sameSite: 'lax'
  }
}));

/* MIDDLEWARE para reconocer el usuario en todas las vistas */
app.use((req, res, next) => {
    res.locals.userIdSesion = req.session.userId; 
    next();
});

app.use('/imagen', imagenRouter);
app.use('/mensaje', mensajesRouter);
app.use('/usuario', usuariosRouter);
app.use('/etiqueta', etiquetaRouter);
app.use('/comentario', comentariosRouter);
app.use('/publicacion', publicacionesRouter);
app.use('/notificacion', notificacionesRouter)
app.use('/', indexRouter);

// Atrapar un Error 404 y seguir al Manejador de Error
app.use((req, res, next) => { next(createError(404)); });

// Manejador de Error
app.use((err, req, res, next) => {
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err);
  res.status(err.status || 500).render('error', { message: err.message });
});

app.listen(process.env.PORT, () => { console.log('Servidor corriendo'); });

module.exports = app;