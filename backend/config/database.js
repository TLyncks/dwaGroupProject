require('dotenv').config();
const mysql = require('mysql2');

// The DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, and DB_PORT are stored in environment variables.
const connection = mysql.createConnection({
  host: process.env.DB_HOST = "localhost",
  user:  process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:  process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Test Database Connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

function closeDatabaseConnection() {
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
}


module.exports = {
  connection,
  closeDatabaseConnection
};

