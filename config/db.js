const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tpi_web2',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 75
});

module.exports = pool.promise();