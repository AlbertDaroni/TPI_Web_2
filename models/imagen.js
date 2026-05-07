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
        }
    }, {
        sequelize,
        modelName: 'Imagen',
        tableName: 'imagenes'
    }
);

Publicacion.hasMany(Imagen, { foreignKey: 'id_publicacion', onDelete: 'CASCADE' });
Imagen.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

module.exports = Imagen;

/* async function obtener(id) {
    try {
        const {rows} = await db.query('SELECT * FROM imagenes WHERE id = $1', [id]);
        return { imagen: rows[0] };
    } catch (error) { throw error; }
}

async function obtenerTodasDeUnaPublicacion(id) {
    try {
        const {rows} = await db.query('SELECT * FROM imagenes WHERE id_publicacion = $1', [id]);
        return rows;
    } catch (error) { throw error; }
}

async function crear(imagen) {
    try {
        const result = await db.query(`
            INSERT INTO imagenes(imagen, licencia, id_publicacion)
            VALUES($1, 0, $2) RETURNING id`, [imagen.imagen, imagen.id_publicacion]
        );
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function eliminar(id) {
    try {
        const result = await db.query('DELETE FROM imagenes WHERE id_publicacion = $1', [id]);
        if (result.rowCount > 0) { return true; } else { return false; }
    } catch (error) { throw error; }
}

module.exports = {
    obtener,
    obtenerTodasDeUnaPublicacion,
    crear,
    eliminar
}; */