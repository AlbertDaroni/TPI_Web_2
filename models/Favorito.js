const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Publicacion = require('./Publicacion');
const Usuario = require('./Usuario');

class Favorito extends Model {}

Favorito.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'Mi Lista'
        }
    }, {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'Favorito',
        tableName: 'favoritos'
    }
);

module.exports = Favorito;