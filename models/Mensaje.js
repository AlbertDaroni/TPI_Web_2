const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');

class Mensaje extends Model {}

Mensaje.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        texto: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'Mensaje',
        tableName: 'mensajes'
    }
);

Usuario.hasMany(Mensaje, { foreignKey: 'id_usuario', as: 'MensajesEnviados' });
Usuario.hasOne(Mensaje, { foreignKey: 'id_seguido', as: 'MensajesRecibidos' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'Emisor' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_seguido', as: 'Receptor' });

module.exports = Mensaje;