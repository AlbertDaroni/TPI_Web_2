const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Publicacion = require('./Publicacion');
const Usuario = require('./Usuario');

class Favorito extends Model {}

Favorito.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'Mi Lista'
        }
    }, {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'Favorito',
        tableName: 'favoritos'
    }
);

Usuario.hasMany(Favorito, { foreignKey: 'id_usuario' });
Publicacion.hasMany(Favorito, { foreignKey: 'id_publicacion' });
Favorito.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Favorito.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

module.exports = Favorito;

/* async function obtenerPorNombre(nombre, id) {
    try {
        const {rows} = await db.query(`SELECT * FROM favoritos WHERE nombre ILIKE '%' || $1 || '%' AND id_usuario = $2`, [nombre, id]);

        const ids = rows.map(favorita => favorita.id_publicacion);
        if (ids.length === 0) return [];

        let publicaciones = [];
        
        for (const id_pub of ids) { publicaciones.push(await publicacion.obtenerPorID(id_pub, id)); }
        return publicaciones;
    } catch (error) { throw error; }
}

async function obtenerTodasDeUnUsuario(id) {
    try {
        const {rows} = await db.query(`SELECT * FROM favoritos WHERE id_usuario = $1`, [id]);

        const ids = rows.map(favorita => favorita.id_publicacion);
        if (ids.length === 0) return [];

        let publicaciones = [];
        
        for (const id_pub of ids) { publicaciones.push(await publicacion.obtenerPorID(id_pub, id)); }
        return publicaciones;
    } catch (error) { throw error; }
}

async function obtenerListas(id) {
    try {
        const {rows} = await db.query(`SELECT nombre FROM favoritos WHERE id_usuario = $1`, [id]);
        return rows;
    } catch (error) { throw error; }
}

async function crear(favorito) {
    try {
        const result = await db.query(`
            INSERT INTO favoritos(nombre, id_publicacion, id_usuario)
            VALUES($1, $2, $3)`, [favorito.nombre, favorito.id_publicacion, favorito.id_usuario]
        );
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function eliminar(id) {
    try {
        const result = await db.query('DELETE FROM favoritos WHERE id_publicacion = $1', [id]);
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function eliminarLista(nombre, id) {
    try {
        const result = await db.query(`DELETE FROM favoritos WHERE nombre ILIKE '%' || $1 || AND id_usuario = $2`, [nombre, id]);
        if (result.rowCount > 0) { return true; } else { return false; }
    } catch (error) { throw error; }
}

module.exports = {
    obtenerPorNombre,
    obtenerTodasDeUnUsuario,
    obtenerListas,
    crear,
    eliminar,
    eliminarLista
}; */