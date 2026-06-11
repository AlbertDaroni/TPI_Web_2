const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Seguidor extends Model {}

Seguidor.init(
    {
        id_seguido: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'usuarios', key: 'id' }
        },
        id_seguidor: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'usuarios', key: 'id' }
        }
    }, {
        sequelize,
        timestamps: true,
        modelName: 'Seguidor',
        tableName: 'seguidores'
    }
);

module.exports = Seguidor;