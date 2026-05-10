const Likes = require('./Likes');
const Imagen = require('./Imagen');
const Usuario = require('./Usuario');
const Mensaje = require('./Mensaje');
const Denuncia = require('./Denuncia');
const Etiqueta = require('./Etiqueta');
const Favorito = require('./Favorito');
const Validador = require('./Validador');
const Comentario = require('./Comentario');
const Publicacion = require('./Publicacion');
const Notificacion = require('./Notificacion');

// ASOCIACIONES
// Comentario
Usuario.hasMany(Comentario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Publicacion.hasMany(Comentario, { foreignKey: 'id_publicacion', onDelete: 'CASCADE' });
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Comentario.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

// Denuncia
Publicacion.hasMany(Denuncia, { foreignKey: 'id_publicacion' });
Comentario.hasMany(Denuncia, { foreignKey: 'id_comentario' });
Usuario.hasMany(Denuncia, { foreignKey: 'id_usuario' });
Denuncia.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });
Denuncia.belongsTo(Comentario, { foreignKey: 'id_comentario' });
Denuncia.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Etiqueta
Publicacion.hasMany(Etiqueta, { foreignKey: 'id_publicacion' });
Etiqueta.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

// Favorito
Usuario.hasMany(Favorito, { foreignKey: 'id_usuario' });
Publicacion.hasMany(Favorito, { foreignKey: 'id_publicacion' });
Favorito.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Favorito.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

// Imagen
Publicacion.hasMany(Imagen, { foreignKey: 'id_publicacion', onDelete: 'CASCADE' });
Imagen.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

// Likes
Usuario.hasMany(Likes, { foreignKey: 'id_usuario' });
Publicacion.hasMany(Likes, { foreignKey: 'id_publicacion' });
Likes.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Likes.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

// Mensaje
Usuario.hasMany(Mensaje, { foreignKey: 'id_usuario', as: 'MensajesEnviados' });
Usuario.hasMany(Mensaje, { foreignKey: 'id_seguido', as: 'MensajesRecibidos' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'Emisor' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_seguido', as: 'Receptor' });

// Notificación
Usuario.hasMany(Notificacion, { foreignKey: 'id_dueño', onDelete: 'CASCADE' });
Usuario.hasMany(Notificacion, { foreignKey: 'id_causante', onDelete: 'CASCADE' });
Publicacion.hasOne(Notificacion, { foreignKey: 'id_publicacion', onDelete: 'CASCADE' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_dueño', as: 'Dueño' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_causante', as: 'Causante' });
Notificacion.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

// Publicación
Usuario.hasMany(Publicacion, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Publicacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

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
    Likes,
    Imagen,
    Mensaje,
    Usuario,
    Denuncia,
    Etiqueta,
    Favorito,
    Validador,
    Comentario,
    Publicacion,
    Notificacion
}