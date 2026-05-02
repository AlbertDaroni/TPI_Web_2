const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tpi_web2',
  password: 'admin123',
  port: 5432,
});

module.exports = { query: (text, params) => pool.query(text, params) };