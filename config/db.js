const { Sequelize } = require('sequelize');
require('pg');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: { // Esto es para que Vercel lo acepte
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL con Sequelize establecida');
  } catch (error) { console.error('No se pudo conectar a la base de datos:', error); }
};

module.exports = sequelize;