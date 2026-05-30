const Imagen = require('./Imagen');
const Usuario = require('./Usuario');
const Mensaje = require('./Mensaje');
const Etiqueta = require('./Etiqueta');
const Favorito = require('./Favorito');
const Validador = require('./Validador');
const Comentario = require('./Comentario');
const Valoracion = require('./Valoracion');
const Publicacion = require('./Publicacion');
const Notificacion = require('./Notificacion');

// ASOCIACIONES
// Comentario
Usuario.hasMany(Comentario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Imagen.hasMany(Comentario, { foreignKey: 'id_imagen', onDelete: 'CASCADE' });
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Comentario.belongsTo(Imagen, { foreignKey: 'id_imagen' });

// Etiqueta
Publicacion.hasMany(Etiqueta, { foreignKey: 'id_publicacion' });
Etiqueta.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

// Favorito
Usuario.hasMany(Favorito, { foreignKey: 'id_usuario' });
Publicacion.hasMany(Favorito, { foreignKey: 'id_publicacion' });
Imagen.hasMany(Favorito, { foreignKey: 'id_imagen' });
Favorito.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Favorito.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });
Favorito.belongsTo(Imagen, { foreignKey: 'id_imagen' });

// Imagen
Publicacion.hasMany(Imagen, { foreignKey: 'id_publicacion', onDelete: 'CASCADE' });
Imagen.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

// Mensaje
Usuario.hasMany(Mensaje, { foreignKey: 'id_usuario', as: 'MensajesEnviados' });
Usuario.hasMany(Mensaje, { foreignKey: 'id_seguido', as: 'MensajesRecibidos' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'Emisor' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_seguido', as: 'Receptor' });

// Notificación
Usuario.hasMany(Notificacion, { foreignKey: 'id_dueno', onDelete: 'CASCADE' });
Usuario.hasMany(Notificacion, { foreignKey: 'id_causante', onDelete: 'CASCADE' });
Imagen.hasMany(Notificacion, { foreignKey: 'id_imagen', onDelete: 'CASCADE' });
Comentario.hasMany(Notificacion, { foreignKey: 'id_comentario', onDelete: 'CASCADE' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_dueno', as: 'Dueño' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_causante', as: 'Causante' });
Notificacion.belongsTo(Imagen, { foreignKey: 'id_imagen' });
Notificacion.belongsTo(Comentario, { foreignKey: 'id_comentario' })

// Publicación
Usuario.hasMany(Publicacion, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Publicacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Valoración
Imagen.hasMany(Valoracion, { foreignKey: 'id_imagen' });
Usuario.hasMany(Valoracion, { foreignKey: 'id_usuario' });
Valoracion.belongsTo(Imagen, { foreignKey: 'id_imagen' });
Valoracion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Seguidores
Usuario.belongsToMany(Usuario, { 
    as: 'Seguidores', 
    through: 'seguidores', 
    foreignKey: 'id_seguido', 
    otherKey: 'id_seguidor' 
});

Usuario.belongsToMany(Usuario, { 
    as: 'Seguidos', 
    through: 'seguidores', 
    foreignKey: 'id_seguidor', 
    otherKey: 'id_seguido' 
});

// Validador
Publicacion.hasMany(Validador, { foreignKey: 'id_publicacion' });
Validador.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

module.exports = {
    Imagen,
    Mensaje,
    Usuario,
    Etiqueta,
    Favorito,
    Validador,
    Comentario,
    Valoracion,
    Publicacion,
    Notificacion
}