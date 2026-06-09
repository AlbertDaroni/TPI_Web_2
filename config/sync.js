const fs = require('fs');
const path = require('path');
const sequelize = require('./db');
const popular = require('../popular');

const uploads = path.join(__dirname, '../public/uploads');

fs.readdir(uploads, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.rm(path.join(uploads, file), { recursive: true, force: true }, err => {
      if (err) throw err;
    });
  }
});

console.log('Sincronizando las tablas en la base de datos.');

sequelize.sync({ force: true })
    .then(async () => {
        console.log('Tablas creadas exitosamente en PostgreSQL');
        try {
            console.log('Poblando la base de datos.');
            await popular.popular();
            console.log('Base de datos poblada exitosamente.');
            process.exit(0);
        } catch (error) { console.log('Error poblando la base de datos:', error); process.exit(1); }
    })
    .catch(error => {
        console.error('Error al sincronizarse con la base de datos:', error);
        process.exit(1);
    });