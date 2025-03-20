require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

// Import our database module
const dbModule = require('./database');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: false
  })
);

// Serve static files from the "non members" folder
app.use(express.static('non members'));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ------------------------
// GET all users (existing code)
// ------------------------
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  dbModule.executeQuery(query, [], (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// ------------------------
// Sign Up Route (existing code)
// ------------------------
app.post('/signup', async (req, res) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;

  if (!fullName || !email || !password) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    dbModule.executeQuery(checkQuery, [email], async (err, results) => {
      if (err) return res.status(500).send('Database error');
      if (results.length > 0) {
        return res.status(400).send('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = 'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)';
      dbModule.executeQuery(insertQuery, [fullName, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).send('Database error');
        req.session.user = { id: result.insertId, email };
        res.send('User registered successfully');
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// ------------------------
// Log In Route (existing code)
// ------------------------
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Missing email or password');
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  dbModule.executeQuery(query, [email], async (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length === 0) return res.status(400).send('User not found');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    req.session.user = { id: user.id, email: user.email };
    res.send('Logged in successfully');
  });
});

// ------------------------
// Log Out Route (existing code)
// ------------------------
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Could not log out');
    res.send('Logged out successfully');
  });
});

// ------------------------
// Membership Application Submission (existing code)
// ------------------------
app.post('/apply', (req, res) => {
  const { firstName, lastName, email, phone, membershipType, reason, participated, heardAbout } = req.body;
  if (!firstName || !lastName || !email || !phone || !membershipType || !reason || !participated || !heardAbout) {
    return res.status(400).send("Missing required fields");
  }

  const insertQuery = `
    INSERT INTO membership_applications
    (first_name, last_name, email, phone, membership_type, reason, participated, heard_about)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [firstName, lastName, email, phone, membershipType, reason, participated, heardAbout];

  dbModule.executeQuery(insertQuery, params, (err, result) => {
    if (err) {
      console.error("Error inserting application:", err);
      return res.status(500).send("Database error");
    }
    res.send("Application submitted successfully");
  });
});

// =========================================================
// NEW EVENTS ROUTES
// =========================================================

// GET all events from the "events" table
app.get('/api/events', (req, res) => {
  const query = 'SELECT * FROM events ORDER BY event_date ASC';
  dbModule.executeQuery(query, [], (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).send('Database error');
    }
    // Return events as JSON
    res.json(results);
  });
});

// POST a new event to the "events" table (optional, if you want to add events from the front end)
app.post('/api/events', (req, res) => {
  const { title, event_date, location, description, image_path, category } = req.body;
  // Minimal validation
  if (!title || !event_date) {
    return res.status(400).send('Missing required fields');
  }

  const insertQuery = `
    INSERT INTO events (title, event_date, location, description, image_path, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [title, event_date, location, description, image_path, category];

  dbModule.executeQuery(insertQuery, params, (err, result) => {
    if (err) {
      console.error('Error inserting event:', err);
      return res.status(500).send('Database error');
    }
    res.send('Event created successfully');
  });
});

// ------------------------
// Error Handling Middleware
// ------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ------------------------
// Graceful Shutdown
// ------------------------
const gracefulShutdown = () => {
  console.info('Shutdown signal received...');
  dbModule.connection.end(err => {
    if (err) {
      console.error('Error closing database connection:', err);
    }
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
  setTimeout(() => {
    console.error('Force shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
