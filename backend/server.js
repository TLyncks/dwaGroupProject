require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database.js'); 

const app = express();
app.use(express.json());
app.use(cors()); 

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Test Database Connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
