const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Publicacion = require('./Publicacion');
const Usuario = require('./Usuario');

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

Usuario.hasMany(Comentario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Publicacion.hasMany(Comentario, { foreignKey: 'id_publicacion', onDelete: 'CASCADE' });
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Comentario.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

module.exports = Comentario;

/* async function obtener(id) {
    try {
        const {rows} = await db.query('SELECT * FROM comentarios WHERE id = $1', [id]);
        return rows[0];
    } catch (error) { throw error; }
}

async function obtenerUsuarioDeComentario(id) {
    try {
        const {rows} = await db.query(`
            SELECT u.id, u.nombre, u.foto_perfil FROM usuarios u 
            JOIN comentarios c ON u.id = c.id_usuario WHERE c.id = $1`, [id]
        );
        return rows[0];
    } catch (error) { throw error; }
}

async function obtenerComentariosDeUnaPublicacion(id) {
    try {
        const {rows} = await db.query(`
            SELECT c.*, u.nombre, u.foto_perfil 
            FROM comentarios c
            JOIN usuarios u ON c.id_usuario = u.id
            WHERE c.id_publicacion = $1`, [id]
        );

        const comentarios = rows.map(row => ({
            ...row,
            usuario: { id: row.id_usuario, nombre: row.nombre, foto_perfil: row.foto_perfil }
        }));
        
        return { comentarios: comentarios, cantidad: rows.length };
    } catch (error) { throw error; }
}

async function actualizarDenuncias(operacion, id) {
    try {
        let result;
        switch (operacion) {
            case "suma":
                result = await db.query('UPDATE comentarios SET denuncias = denuncias + 1 WHERE id = $1', [id]); break;
            case "resta":
                result = await db.query('UPDATE comentarios SET denuncias = denuncias - 1 WHERE id = $1', [id]); break;
        }
        if (result.rowCount === 1) { return true; } else { return false; }
        } catch (error) { throw error; }
}

async function obtenerDueño(id) {
    try {
        const {rows} = await db.query(`
            SELECT u.id FROM usuarios u 
            JOIN comentarios c ON u.id = c.id_usuario WHERE c.id = $1`, [id]
        );
        return rows[0].id;
    } catch (error) { throw error; }
}

async function obtenerPublicacionCorrespondiente(id) {
    try {
        const {rows} = await db.query(`
            SELECT p.id FROM publicaciones p
            JOIN comentarios c ON p.id = c.id_publicacion WHERE c.id = $1`, [id]
        );
        return rows[0].id;
    } catch (error) { throw error; }
}

async function crear(comentario) {
    try {
        const result = await db.query(`
            INSERT INTO comentarios(comentario, fecha, denuncias, id_publicacion, id_usuario)
            VALUES($1, NOW(), 0, $2, $3)`, [comentario.comentario, comentario.id_publicacion, comentario.id_usuario]
        );
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function modificar(comentario) {
    try {
        const result = await db.query(`
            UPDATE comentarios SET comentario = $1, denuncias = $2 WHERE id = $3`, 
            [comentario.comentario, comentario.denuncias, comentario.id]
        );
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function eliminar(id) {
    try {
        const result = await db.query('DELETE FROM comentarios WHERE id = $1', [id]);
        if (result.rowCount > 0) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function eliminarTodosDeUnaPublicacion(id) {
    try {
        const result = await db.query('DELETE FROM comentarios WHERE id_publicacion = $1', [id]);
        if (result.rowCount > 0) { return true; } else { return false; }
    } catch (error) { throw error; }
}

module.exports = {
    obtener,
    obtenerUsuarioDeComentario,
    obtenerComentariosDeUnaPublicacion,
    actualizarDenuncias,
    obtenerDueño,
    obtenerPublicacionCorrespondiente,
    crear,
    modificar,
    eliminar,
    eliminarTodosDeUnaPublicacion
}; */