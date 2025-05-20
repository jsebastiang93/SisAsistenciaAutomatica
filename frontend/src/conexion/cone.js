require('dotenv').config();
const { Pool } = require('pg');

// Convertir 'false' (string) en booleano real
const useSSL = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  ssl: {
    rejectUnauthorized: useSSL
  }
});

module.exports = pool;
