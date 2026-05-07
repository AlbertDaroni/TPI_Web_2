const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');

class Publicacion extends Model {}

Publicacion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        denuncias: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'Publicacion',
        tableName: 'publicaciones'
    }
);

Usuario.hasMany(Publicacion, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Publicacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = Publicacion;

/* const db = require('../config/db');
const imagen = require('./imagen');
const comentario = require('./comentarios');
const etiqueta = require('./etiqueta');
const denuncia = require('./denuncia');

async function crear(publicacion, id) {
    try {
        const result = await db.query(`
            INSERT INTO publicaciones (titulo, descripcion, likes, fecha, denuncias, id_usuario)
            VALUES ($1, $2, 0, NOW(), 0, $3) RETURNING id`, [publicacion.titulo, publicacion.descripcion, id]
        );
        if (result.rowCount === 1) { return { agregada: true, publicacion: result.rows[0].id }; } else { return false; }
    } catch (error) { throw error; }
}

async function actualizarDenuncias(operacion, id) {
    try {
        let result;
        switch (operacion) {
            case "suma":
                result = await db.query('UPDATE publicaciones SET denuncias = denuncias + 1 WHERE id = $1', [id]); break;
            case "resta":
                result = await db.query('UPDATE publicaciones SET denuncias = denuncias - 1 WHERE id = $1', [id]); break;
        }
        if (result.rowCount === 1) { return true; } else { return false; }
        } catch (error) { throw error; }
}

async function eliminar(id) {
    try {
        let resultado = false;
        resultado = await imagen.eliminar(id);
        resultado = await comentario.eliminarTodosDeUnaPublicacion(id);
        resultado = await etiqueta.eliminarTodasDeUnaPublicacion(id);
        const result = await db.query('DELETE FROM publicaciones WHERE id = $1', [id]);
        if (result.rowCount === 1) { resultado = true; }

        if (resultado === true) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function obtenerPorID(id, userId) {
    try {
        const {rows} = await db.query('SELECT * FROM publicaciones WHERE id = $1', [id]);
        const publicacion = await obtenerDatosCompletos(rows, userId);
        return { publicacion: publicacion[0] };
    } catch (error) { throw error; }
}

async function obtenerPorTitulo(titulo, userId) {
    try {
        const {rows} = await db.query(`SELECT * FROM publicaciones WHERE titulo LIKE '%' || $1 || '%'`, [titulo]);
        const publicacion = await obtenerDatosCompletos(rows, userId);
        return { publicacion: publicacion[0] };
    } catch (error) { throw error; }
}

async function obtener10Publicaciones(userId) {
    try {
        const {rows} = await db.query('SELECT * FROM publicaciones ORDER BY random() LIMIT 10');
        const publicaciones = await obtenerDatosCompletos(rows, userId);
        return publicaciones;
    } catch(error) { throw error; }
}

async function obtenerPublicacionesDeUnUsuario(id, userId) {
    try {
        const {rows} = await db.query('SELECT * FROM publicaciones WHERE id_usuario = $1', [id]);
        const publicaciones = await obtenerDatosCompletos(rows, userId);
        return publicaciones;
    } catch (error) { throw error; }
}

async function obtenerPublicacionesDeVariosUsuarios(ids, userId) {
    try {
        const {rows} = await db.query('SELECT * FROM publicaciones WHERE id_usuario = ANY($1)', [ids]);
        const publicaciones = await obtenerDatosCompletos(rows, userId);
        return publicaciones;
    } catch (error) { throw error; }
}

async function obtenerDueño(id) {
    try {
        const {rows} = await db.query('SELECT u.id FROM usuarios u JOIN publicaciones p ON u.id = p.id_usuario WHERE p.id = $1)', [id]);
        return rows[0].id;
    } catch (error) { throw error; }
}

async function obtenerDatosCompletos(publicaciones, userId) {
    const datos = await Promise.all(publicaciones.map(async (publicacion) => {
        const [imagenes, usuario, infoComentarios, likes, etiquetas, denuncias] = await Promise.all([
            imagen.obtenerTodasDeUnaPublicacion(publicacion.id),
            obtenerUsuarioDeLaPublicacion(publicacion.id),
            comentario.obtenerComentariosDeUnaPublicacion(publicacion.id),
            obtenerLikes(publicacion.id),
            etiqueta.obtenerEtiquetas(publicacion.id),
            denuncia.obtenerTodasDeUnaPublicacion(publicacion.id)
        ]);

        const dioLike = likes.some(l => l.id_usuario === userId);

        return {
            publicacion, imagenes, usuario,
            comentarios: infoComentarios.comentarios, cantidad: infoComentarios.cantidad, 
            likes, dioLike, etiquetas, denuncias
        };
    }));
    
    return datos;

    async function obtenerUsuarioDeLaPublicacion(id) {
        try {
            const {rows} = await db.query('SELECT id, nombre, foto_perfil FROM usuarios WHERE id = (SELECT id_usuario FROM publicaciones WHERE id = $1)', [id]);
            return rows[0];
        } catch (error) { throw error; }
    }

    async function obtenerLikes(id) {
        try {
            const {rows} = await db.query('SELECT * FROM likes WHERE id_publicacion = $1', [id]);
            return rows;
        } catch (error) { throw error; }
    }
}

module.exports = {
    crear,
    actualizarDenuncias,
    eliminar,
    obtenerPorID,
    obtenerPorTitulo,
    obtener10Publicaciones,
    obtenerPublicacionesDeUnUsuario,
    obtenerPublicacionesDeVariosUsuarios,
    obtenerDueño
}; */