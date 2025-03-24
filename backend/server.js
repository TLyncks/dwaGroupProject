<<<<<<< HEAD
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
    secret: process.env.SESSION_SECRET || 'yourSecretKey', // Use a strong secret in production
    resave: false,
    saveUninitialized: false
  })
);

// Serve static files from the "non members" folder (adjust if needed)
app.use(express.static('non members'));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ------------------------
// GET Route: Retrieve all users from the "users" table
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
// GET Route: Retrieve all events from the "events" table
// ------------------------
app.get('/events', (req, res) => {
  const query = 'SELECT * FROM events';
  dbModule.executeQuery(query, [], (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).send("Database error");
    }
    res.json(results);
  });
});

// ------------------------
// Sign Up Route
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
// Log In Route
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
// Log Out Route
// ------------------------
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Could not log out');
    res.send('Logged out successfully');
  });
});

// ------------------------
// Membership Application Submission Route
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
=======
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./config/database.js')
const eventRoutes = require('./admin/routes/eventRoutes.js')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded data
app.use(cors())
app.use('/uploads', express.static('./backend/uploads'))

app.use('/events', eventRoutes)

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT']
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing environment variable: ${envVar}`)
    process.exit(1)
  }
})

const PORT = process.env.PORT || 5000
//insert route specificaitons i think
app.get('/', (req, res) => {
  res.send('API is running...')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  })
})

const gracefulShutdown = () => {
  console.info('Shutdown signal received...')
  // No need to end when using pool
  /*db.end((err) => {
        if (err) {
            console.error('Error closing database connection:', err);
        }
        server.close(() => {
            console.log('Server closed.');
            process.exit(0);
        });
    });
    */

  // Forcefully close after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 10000)
}

// Handle both SIGTERM and SIGINT
process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
>>>>>>> a905cb177074a538ac643fecda6bf2a69a4cd211

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`Server running on http://localhost:${PORT}`);
});
=======
  console.log(`Server running on http://localhost:${PORT}`)
})
>>>>>>> a905cb177074a538ac643fecda6bf2a69a4cd211
