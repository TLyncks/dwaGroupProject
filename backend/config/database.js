require('dotenv').config()
const mysql = require('mysql2/promise')

// The DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, and DB_PORT are stored in environment variables.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: 'Z' // Ensures UTC time
})

// No need to close connection in this case
/*function closeDatabaseConnection() {
  return new Promise((resolve, reject) => {
    connection.end(err => {
      if (err) {
        console.error('Error closing database connection:', err);
        reject(err);
        return;
      }
      console.log('Database connection closed successfully');
      resolve();
    });
  });
}*/

if (pool){
  console.log('Database connection pool created successfully')

}

module.exports = {
  pool
}