const path = require('path');
const logger = require('morgan');
const express = require('express');
const sesion = require('express-session');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
const mensajesRouter = require('./routes/mensaje');
const usuariosRouter = require('./routes/usuario');
const comentariosRouter = require('./routes/comentario');
const publicacionesRouter = require('./routes/publicacion');
const notificacionesRouter = require('./routes/notificacion');

const sequelize = require('./config/db');
const { Imagen, Mensaje, Usuario, Etiqueta, Favorito, Validador, Comentario, Valoracion, Publicacion, Notificacion } = require('./models');
const popular = require('./popular');

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

app.use('/mensaje', mensajesRouter);
app.use('/usuario', usuariosRouter);
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

sequelize.sync({ alter: true, force: false })
  .then(async () => {
    console.log('Modelos sincronizados con la base de datos');
    // try { await popular.popular(); } catch (error) { console.log(error); }

    const puerto = 3000;
    app.listen(puerto, () => console.log(`Servidor corriendo en http://localhost:${puerto}`));
  })
  .catch(error => console.error('Error al sincronizarse con la base de datos:', error));

module.exports = app;