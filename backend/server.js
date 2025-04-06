require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

// 1) Import the pool from your database configuration
const { pool } = require('./config/database.js'); // <-- adjust path if needed

const app = express();

// ====== CORS / Custom Headers Middleware ======
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ====== MIDDLEWARE ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('./backend/uploads'));
app.use(express.static(path.join(__dirname, '../frontend')));

// ====== SESSION SETUP ======
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    // Uncomment below if needed:
    /*
     cookie: {
      secure: process.env.NODE_ENV === 'production', 
     httpOnly: false,
      sameSite: 'None',
     }, */
  })
);

// ====== ROUTES ======
const eventRoutes = require('./admin/routes/eventRoutes.js');
const memberRoutes = require('./admin/routes/memberRoutes.js');
const userRoutes = require('./non members/Routes/registrationRoute.js');
const authRoute = require('./non members/Routes/authRoute.js');
const supportRoute = require('./non members/Routes/SupportRoute.js');
const memberRoutesThis = require('./Members/memberRoutes.js');

// Mount the routes
app.use('/', userRoutes);
app.use('/events', eventRoutes);
app.use('/', authRoute);
app.use('/member', memberRoutesThis);
app.use('/member-admin', memberRoutes);
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
      heardAbout,
    } = req.body;

    // 1) Check for existing application with the same email
    const [existingRows] = await pool.query(
      'SELECT * FROM membership_application WHERE email = ?',
      [email]
    );
    if (existingRows.length > 0) {
      return res
        .status(409)
        .json({ error: 'Submission failed: User already has an account.' });
    }

    // 2) Insert the new application
    const [result] = await pool.query(
      `INSERT INTO membership_application
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

// ====== ROOT ENDPOINT ======
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
