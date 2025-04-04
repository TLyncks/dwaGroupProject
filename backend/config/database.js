require('dotenv').config();
const mysql = require('mysql2/promise');

// Create the pool with your environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  maxIdle: 10,      // max idle connections (default = connectionLimit)
  idleTimeout: 60000, // idle connections timeout (ms)
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: 'Z', // Ensures UTC time
});

if (pool) {
  console.log('Database connection pool created successfully');
}

module.exports = {
  pool,
};
