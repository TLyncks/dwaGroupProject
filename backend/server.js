require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey', // Use a strong secret from an env var in production
  resave: false,
  saveUninitialized: false
}));

// Check for required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing environment variable: ${envVar}`);
    process.exit(1);
  }
});

// Create MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Sign Up Route
app.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).send('Missing required fields');
  }
  try {
    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).send('Database error');
      if (results.length > 0) {
        return res.status(400).send('User already exists');
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
        [fullName, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).send('Database error');
          // Optionally create a session here
          req.session.user = { id: result.insertId, email };
          res.send('User registered successfully');
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Log In Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Missing email or password');

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length === 0) return res.status(400).send('User not found');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    req.session.user = { id: user.id, email: user.email };
    res.send('Logged in successfully');
  });
});

// Log Out Route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Could not log out');
    res.send('Logged out successfully');
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Graceful Shutdown
const gracefulShutdown = () => {
  console.info('Shutdown signal received...');
  db.end((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
    }
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });

  // Force shutdown after 10 seconds if necessary
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
