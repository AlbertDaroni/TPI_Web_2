const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Comentario extends Model {}

Comentario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        texto: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        denuncias: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        sequelize,
        timestamps: true,
        modelName: 'Comentario',
        tableName: 'comentarios'
    }
);

module.exports = Comentario;