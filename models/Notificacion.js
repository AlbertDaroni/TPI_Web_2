const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Publicacion = require('./Publicacion');
const Usuario = require('./Usuario');

class Notificacion extends Model {}

Notificacion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tipo_evento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        motivo: {
            type: DataTypes.TEXT,
        },
        vista: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        createdAt: true,
        modelName: 'Notificacion',
        tableName: 'notificaciones'
    }
);

Usuario.hasMany(Notificacion, { foreignKey: 'id_dueño', onDelete: 'CASCADE' });
Usuario.hasOne(Notificacion, { foreignKey: 'id_causante', onDelete: 'CASCADE' });
Publicacion.hasOne(Notificacion, { foreignKey: 'id_publicacion', onDelete: 'CASCADE' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_dueño', as: 'Dueño' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_causante', as: 'Causante' });
Notificacion.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

module.exports = Notificacion;

/* async function obtener(id) {
    try {
        const {rows} = await sequelize.query(`
            SELECT n.*, u.nombre, u.foto_perfil, p.titulo
            FROM notificaciones n
            JOIN usuarios u ON n.id_causante = u.id
            LEFT JOIN publicaciones p ON n.id_publicacion = p.id
            WHERE id_dueño = $1
            ORDER BY fecha DESC`, [id]
        );

        return { notificaciones: rows};
    } catch (error) { throw error; }
}

async function crear(notificacion) {
    try {
        const result = await sequelize.query(`
            INSERT INTO notificaciones(tipo_evento, motivo, fecha, vista, id_causante, id_dueño, id_publicacion)
            VALUES ($1, $2, NOW(), 0, $3, $4, $5) RETURNING id`,
            [notificacion.tipo_evento, notificacion.motivo, notificacion.id_causante || null, notificacion.id_dueño || null, notificacion.id_publicacion || null]
        );
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch(error) { throw error; }
}

async function eliminar(id) {
    try {
        const result = await sequelize.query('DELETE FROM notificaciones WHERE id_dueño = $1', [id]);
        if (result.rowCount > 0) { return true; } else { return false; }
    } catch(error) { throw error; }
}

async function actualizarVisto(id) {
    try {
        const {rows} = await sequelize.query('SELECT vista FROM notificaciones WHERE id = $1', [id]);
        if (rows[0].vista === 0) await sequelize.query('UPDATE notificaciones SET vista = 1 WHERE id = $1', [id]);
        return rows[0].vista;
    } catch (error) { throw error; }
}

module.exports = {
    obtener,
    crear,
    eliminar,
    actualizarVisto
}; */