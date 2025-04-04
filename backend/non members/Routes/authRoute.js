// routes/authRoute.js
const express = require('express');
const router = express.Router();

const { login, logout } = require('../Controllers/authController.js');

// POST /login
router.post('/login', login);

// POST /logout
router.post('/logout', logout);

module.exports = router;