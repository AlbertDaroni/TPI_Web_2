const Imagen = require('./Imagen');
const Usuario = require('./Usuario');
const Mensaje = require('./Mensaje');
const Denuncia = require('./Denuncia');
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

// Mensaje
Usuario.hasMany(Mensaje, { foreignKey: 'id_usuario', as: 'MensajesEnviados' });
Usuario.hasMany(Mensaje, { foreignKey: 'id_seguido', as: 'MensajesRecibidos' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'Emisor' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_seguido', as: 'Receptor' });

// Notificación
Usuario.hasMany(Notificacion, { foreignKey: 'id_dueno', onDelete: 'CASCADE' });
Usuario.hasMany(Notificacion, { foreignKey: 'id_causante', onDelete: 'CASCADE' });
Publicacion.hasOne(Notificacion, { foreignKey: 'id_publicacion', onDelete: 'CASCADE' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_dueno', as: 'Dueño' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_causante', as: 'Causante' });
Notificacion.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

// Publicación
Usuario.hasMany(Publicacion, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Publicacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Valoración
Publicacion.hasMany(Valoracion, { foreignKey: 'id_publicacion' });
Usuario.hasMany(Valoracion, { foreignKey: 'id_usuario' });
Valoracion.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });
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
    Denuncia,
    Etiqueta,
    Favorito,
    Validador,
    Comentario,
    Valoracion,
    Publicacion,
    Notificacion
}