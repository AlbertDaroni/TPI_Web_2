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

Usuario.belongsToMany(Usuario, { 
    as: 'Seguidores', 
    through: 'seguidores', 
    foreignKey: 'id_seguido', 
    otherKey: 'id_seguidor' 
});

Usuario.belongsToMany(Usuario, { 
    as: 'Seguidos', 
    through: 'seguidores', 
    foreignKey: 'id_seguidor', 
    otherKey: 'id_seguido' 
});

module.exports = Usuario;

/* async function obtenerPorID(id) {
    try {
        const {rows} = await sequelize.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        return rows[0];
    } catch (error) { throw error; }
}

async function obtenerPorNombre(nombre) {
    try {
        const {rows} = await sequelize.query(`SELECT * FROM usuarios WHERE nombre LIKE '%' || $1 || '%'`, [nombre]);
        return rows[0];
    } catch (error) { throw error; }
}

async function obtenerPorCredenciales(usuario) {
    try {
        const {rows} = await sequelize.query(`
            SELECT id, nombre, email, contraseña FROM usuarios WHERE nombre LIKE $1 AND email = $2 AND contraseña = $3`,
            [usuario.nombre, usuario.email, usuario.contraseña]
        );
        return rows;
    } catch (error) { throw error; }
}

async function crear(usuario) {
    try {
        const result = await sequelize.query(`
            INSERT INTO usuarios (nombre, email, contraseña, fecha_creacion)
            VALUES ($1, $2, $3, NOW()) RETURNING id`, [usuario.nombre, usuario.email, usuario.contraseña]
        );
        if (result.rowCount === 1) { return { agregado: true, id: result.rows[0].id } } else { return false; }
    } catch (error) { throw error; }
}

async function modificar(usuario) {
    try {
        const result = await sequelize.query(`UPDATE usuarios SET foto_perfil = $1, nombre = $2, email = $3, contraseña = $4, descripcion = $5 WHERE id = $6`,
            [usuario.foto_perfil, usuario.nombre, usuario.email, usuario.contraseña, usuario.descripcion, usuario.id]
        );
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function obtenerSeguidos(id) {
    try {
        const {rows} = await sequelize.query(`
            SELECT u.id, u.nombre, u.foto_perfil 
            FROM usuarios u
            JOIN seguidores s ON u.id = s.id_seguido
            WHERE s.id_seguidor = $1`, [id]
        );
        return { seguidos: rows };
    } catch (error) { console.log('Error al obtener los seguidos:', error); }
}

async function obtenerSeguidores(id) {
    try {
        const {rows} = await sequelize.query(`
            SELECT u.id, u.nombre, u.foto_perfil 
            FROM usuarios u
            JOIN seguidores s ON u.id = s.id_seguidor
            WHERE s.id_seguido = $1`, [id]
        );
        return { seguidores: rows };
    } catch (error) { console.log('Error al obtener los seguidores:', error); }
}

async function obtenerCantidadSeguidos(id) {
    try {
        const {rows} = await sequelize.query('SELECT COUNT(*) AS Total FROM seguidores WHERE id_seguidor = $1', [id]);
        return { seguidos_Cantidad: rows[0].Total };
    } catch (error) { console.log('Error al obtener la cantidad de seguidos:', error); }
}

async function obtenerCantidadSeguidores(id) {
    try {
        const {rows} = await sequelize.query('SELECT COUNT(*) AS Total FROM seguidores WHERE id_seguido = $1', [id]);
        return { seguidores_Cantidad: rows[0].Total };
    } catch (error) { console.log('Error al obtener la cantidad de seguidores:', error); }
}

async function seguir(id1, id2) {
    try {
        const result = await sequelize.query('INSERT INTO seguidores(id_seguidor, id_seguido) VALUES($1, $2)', [id1, id2]);
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function dejarDeSeguir(id1, id2) {
    try {
        const result = await sequelize.query('DELETE FROM seguidores WHERE id_seguidor = $1 AND id_seguido = $2', [id1, id2]);
        if (result.rowCount === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function loSigo(id1, id2) {
    try {
        const {rows} = await sequelize.query('SELECT * FROM seguidores WHERE id_seguidor = $1 AND id_seguido = $2', [id1, id2]);
        if (rows.length === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

async function borrar(id) {
    try {
        const {rows} = await sequelize.query('DELETE FROM usuarios WHERE id = $1', [id]);
        if (rows.length === 1) { return true; } else { return false; }
    } catch (error) { throw error; }
}

module.exports = {
    obtenerPorID,
    obtenerPorNombre,
    obtenerPorCredenciales,
    crear,
    modificar,
    obtenerSeguidos,
    obtenerSeguidores,
    obtenerCantidadSeguidos,
    obtenerCantidadSeguidores,
    seguir,
    dejarDeSeguir,
    loSigo,
    borrar
}; */