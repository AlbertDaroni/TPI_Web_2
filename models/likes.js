const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');
const Publicacion = require('./Publicacion');

class Likes extends Model {}

Likes.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Likes',
        tableName: 'likes'
    }
);

Usuario.hasMany(Likes, { foreignKey: 'id_usuario' });
Publicacion.hasMany(Likes, { foreignKey: 'id_publicacion' });
Likes.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Likes.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

module.exports = Likes;

/* async function actualizarLikes(id1, id2) {
    try {
        const {rows} = await db.query('SELECT id FROM likes WHERE id_publicacion = $1 AND id_usuario = $2', [id2, id1]);

        if (rows.length > 0) {
            await db.query('UPDATE publicaciones SET likes = likes - 1 WHERE id = $1', [id2]);
            await db.query('DELETE FROM likes WHERE id_publicacion = $1 AND id_usuario = $2', [id2, id1]);
        } else {
            await db.query('UPDATE publicaciones SET likes = likes + 1 WHERE id = $1', [id2]);
            await db.query('INSERT INTO likes(id_usuario, id_publicacion) VALUES($1, $2)', [id1, id2]);
        }

        const result = await db.query('SELECT likes FROM publicaciones WHERE id = $1', [id2]);
        return { totalLikes: result.rows[0].likes, dioLike: rows.length === 0 };
    } catch (error) { throw error; }
}

module.exports = { actualizarLikes }; */