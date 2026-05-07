const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tpi_web2', 'postgres', 'admin123', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
});

async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL con Sequelize establecida');
  } catch (error) { console.error('No se pudo conectar a la base de datos:', error); }
};

module.exports = sequelize;