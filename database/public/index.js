// index.js
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Parse incoming JSON and form-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a connection pool to MySQL
const pool = mysql.createPool({
  host: 'localhost',
 ]
  database: 'togetherculture',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL database!');
    connection.release();
  }
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

/** 
 * Example route: GET all events from "events" table
 *  (Only relevant if you actually have a table named "events")
 */
app.get('/events', (req, res) => {
  pool.query('SELECT * FROM events ORDER BY event_date ASC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

/**
 * Example route: Handle workspace application form submissions
 */
app.post('/workspace-application', (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    membership_reason,
    company_address,
    participated_cultural,
    referral_source
  } = req.body;

  // IMPORTANT: Use backticks or quotes around your SQL string
  const sql = `
    INSERT INTO workspace_applications 
      (first_name, last_name, email, phone, membership_reason, company_address, participated_cultural, referral_source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    first_name,
    last_name,
    email,
    phone,
    membership_reason,
    company_address,
    participated_cultural,
    referral_source
  ];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to submit application' });
    }
    res.json({
      message: 'Application submitted successfully!',
      insertId: results.insertId
    });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
