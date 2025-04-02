const express = require('express');
const router = express.Router();

const registrationController = require('../Controllers/registrationController.js');

// Route for user signup
router.post('/signup', registrationController.signup);


module.exports = router;
