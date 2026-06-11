const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Validador extends Model {}

Validador.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'Validador',
        tableName: 'validador'
    }
);

module.exports = Validador;