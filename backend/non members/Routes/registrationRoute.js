const express = require('express');
const router = express.Router();
// The correct path: move up one folder to "non members", then into "Controllers"
const registrationController = require('../Controllers/registrationController.js');

// Route for user signup
router.post('/signup', registrationController.signup);

// Route for user login
router.post('/login', registrationController.login);

module.exports = router;
