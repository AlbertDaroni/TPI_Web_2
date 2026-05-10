const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Publicacion = require('./Publicacion');
const Usuario = require('./Usuario');

class Notificacion extends Model {}

Notificacion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tipo_evento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        motivo: {
            type: DataTypes.TEXT,
        },
        vista: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        createdAt: true,
        modelName: 'Notificacion',
        tableName: 'notificaciones'
    }
);

module.exports = Notificacion;