const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Publicacion = require('./Publicacion');

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

Publicacion.hasMany(Etiqueta, { foreignKey: 'id_publicacion' });
Etiqueta.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

module.exports = Etiqueta;

/* async function obtener(id) {
    try {
        const {rows} = await db.query('SELECT * FROM etiquetas WHERE id = $1', [id]);
        return rows[0];
    } catch (error) { throw error; }
}

async function obtenerEtiquetas(id) {
    try {
        const {rows} = await db.query('SELECT * FROM etiquetas WHERE id_publicacion = $1', [id]);
        return rows;
    } catch (error) { throw error; }
}

async function crear(etiqueta) {
    try {
        const tituloFinal = etiqueta.titulo.startsWith('#') ? etiqueta.titulo : '#' + etiqueta.titulo;

        const result = await db.query(`
            INSERT INTO etiquetas(titulo, id_publicacion)
            VALUES($1, $2)`, [tituloFinal, etiqueta.id_publicacion]
        );
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function modificar(etiqueta) {
    try {
        const result = await db.query('UPDATE etiquetas SET titulo = $1 WHERE id_publicacion = $2 AND id = $3',
            [etiqueta.titulo, etiqueta.id_publicacion, etiqueta.id]);
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function eliminar(id) {
    try {
        const result = await db.query('DELETE FROM etiquetas WHERE id = $1', [id]);
        if (result.rowCount > 0) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function eliminarTodasDeUnaPublicacion(id) {
    try {
        const result = await db.query('DELETE FROM etiquetas WHERE id_publicacion = $1', [id]);
        if (result.rowCount > 0) { return true; } else { return false; }
    } catch (error) { throw error; }
}

module.exports = {
    obtener,
    obtenerEtiquetas,
    crear,
    modificar,
    eliminar,
    eliminarTodasDeUnaPublicacion
}; */