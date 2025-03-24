require('dotenv').config()
const mysql = require('mysql2/promise')

<<<<<<< HEAD:backend/database.js
// Create MySQL connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
=======
// The DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, and DB_PORT are stored in environment variables.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
>>>>>>> a905cb177074a538ac643fecda6bf2a69a4cd211:backend/config/database.js
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

<<<<<<< HEAD:backend/database.js
// Test Database Connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Helper function to execute queries with a callback
function executeQuery(query, params, callback) {
  connection.query(query, params, (err, results, fields) => {
    callback(err, results, fields);
  });
}

function closeDatabaseConnection() {
=======
// No need to close connection in this case
/*function closeDatabaseConnection() {
>>>>>>> a905cb177074a538ac643fecda6bf2a69a4cd211:backend/config/database.js
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
<<<<<<< HEAD:backend/database.js
}

module.exports = {
  connection,
  closeDatabaseConnection,
  executeQuery
};
=======
}*/

module.exports = {
  pool
}
>>>>>>> a905cb177074a538ac643fecda6bf2a69a4cd211:backend/config/database.js
