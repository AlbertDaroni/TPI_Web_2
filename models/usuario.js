const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Usuario extends Model {}

Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        foto_perfil: {
            type: DataTypes.STRING,
            defaultValue: '/images/sin_foto_perfil.png'
        },
        email: {
            type: DataTypes.STRING,
            validate: { isEmail: true },
            allowNull: false
        },
        contraseña: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        descripcion: {
            type: DataTypes.TEXT
        },
        registrado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'Usuario',
        tableName: 'usuarios'
    }
);

module.exports = Usuario;