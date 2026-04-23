const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sesion = require('express-session');

const indexRouter = require('./routes/index');
const usuariosRouter = require('./routes/usuario');
const publicacionesRouter = require('./routes/publicacion');

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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);

module.exports = app;