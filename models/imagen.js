const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Publicacion = require('./Publicacion');

class Imagen extends Model {}

Imagen.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '/images/sin_imagen.png'
        },
        licencia: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        copyright: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Imagen',
        tableName: 'imagenes'
    }
);

module.exports = Imagen;