// Routes/supportRoute.js
const express = require('express');
const router = express.Router();
const supportController = require('../Controllers/supportController.js');

// POST /api/support - handle support request submissions
router.post('/api/support', supportController.submitSupportRequest);

module.exports = router;