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

// Test Database Connection
/*
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});
*/

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
