const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Publicacion = require('./Publicacion');
const Comentario = require('./Comentario');
const Usuario = require('./Usuario');

class Denuncia extends Model {}

Denuncia.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        motivo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        notificada: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'Denuncia',
        tableName: 'denuncias'
    }
);

module.exports = Denuncia;