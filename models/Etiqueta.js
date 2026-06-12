const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Etiqueta extends Model {}

Etiqueta.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Etiqueta',
        tableName: 'etiquetas'
    }
);

module.exports = Etiqueta;