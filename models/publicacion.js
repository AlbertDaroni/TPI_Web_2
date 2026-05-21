const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Publicacion extends Model {}

Publicacion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT
        },
        denuncias: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'Publicacion',
        tableName: 'publicaciones'
    }
);

module.exports = Publicacion;