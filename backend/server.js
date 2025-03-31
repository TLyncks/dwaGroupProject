// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const { pool } = require('./config/database.js'); // Updated path

// Import routes
const eventRoutes = require('./admin/routes/eventRoutes.js');
const userRoutes = require('./non members/Routes/registrationRoute.js');
const supportRoute = require('./non members/Routes/SupportRoute.js');
const authRoute = require('./non members/Routes/authRoute.js');
const memberRoutesThis = require('./Members/memberRoutes.js');

const app = express();

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
  })
);

// Serve static files from the "frontend" folder
app.use(express.static(path.join(__dirname, '../frontend')));

// ====== ROUTES ======
app.use('/user', userRoutes);
app.use('/events', eventRoutes);
app.use('/', authRoute);
app.use('/member', memberRoutesThis);
app.use('/', supportRoute);

// ====== /apply Route ======
app.post('/apply', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      membershipType,
      reason,
      participated,
      heardAbout
    } = req.body;

    // Check for an existing application with the same email.
    const [existingRows] = await pool.query(
      'SELECT * FROM membership_applications WHERE email = ?',
      [email]
    );
    if (existingRows.length > 0) {
      return res
        .status(409)
        .json({ error: 'Submission failed: User already has an account.' });
    }

    // Insert the new application
    const [result] = await pool.query(
      `INSERT INTO membership_applications 
        (first_name, last_name, email, phone, membership_type, reason, participated, heard_about, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [firstName, lastName, email, phone, membershipType, reason, participated, heardAbout]
    );

    console.log('Application inserted, ID:', result.insertId);
    return res.status(200).json({ message: 'Application received successfully' });
  } catch (error) {
    console.error('Error in /apply route:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Example root endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ====== ERROR HANDLER ======
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
