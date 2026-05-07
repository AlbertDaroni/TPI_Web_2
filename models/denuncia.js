const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Publicacion = require('./Publicacion');
const Comentario = require('./Comentario');

class Denuncia extends Model {}

Denuncia.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        motivo: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'Denuncia',
        tableName: 'denuncias'
    }
);

Publicacion.hasMany(Denuncia, { foreignKey: 'id_publicacion' });
Comentario.hasMany(Denuncia, { foreignKey: 'id_comentario' });
Denuncia.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });
Denuncia.belongsTo(Comentario, { foreignKey: 'id_comentario' });

module.exports = Denuncia;

/* async function obtener(id) {
    try {
        const {rows} = await db.query('SELECT * FROM denuncias WHERE id = $1', [id]);
        return rows[0];
    } catch (error) { throw error; }
}

async function obtenerTodasDeUnaPublicacion(id) {
    try {
        const {rows} = await db.query('SELECT * FROM denuncias WHERE id_publicacion = $1', [id]);
        return rows;
    } catch (error) { throw error; }
}

async function obtenerTodasDeUnComentario(id) {
    try {
        const {rows} = await db.query('SELECT * FROM denuncias WHERE id_comentario = $1', [id]);
        return rows;
    } catch (error) { throw error; }
}

async function crear(denuncia) {
    try {
        const result = await db.query(`
            INSERT INTO denuncias (descripcion, fecha, id_publicacion, id_comentario)
            VALUES ($1, NOW(), $2, $3)`, [denuncia.descripcion, denuncia.id_publicacion || null, denuncia.id_comentario || null]
        );
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function eliminar(id) {
    try {
        const result = await db.query('DELETE FROM denuncias WHERE id = $1', [id]);
        if (result.rowCount > 0) { return true; } else { return false; }
    } catch (error) { throw error; }
}

module.exports = {
    obtener,
    obtenerTodasDeUnaPublicacion,
    obtenerTodasDeUnComentario,
    crear,
    eliminar
}; */