const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Valoracion extends Model {}

Valoracion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        valoracion: {
            type: DataTypes.BOOLEAN
        }
    }, {
        sequelize,
        modelName: 'Valoracion',
        tableName: 'valoraciones'
    }
);

module.exports = Valoracion;