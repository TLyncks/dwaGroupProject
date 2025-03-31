const express = require('express');
const router = express.Router();
const { getUserProfile } = require('./memberControllers');
const memberMiddleware = require('./memberMiddleware');

// TODO MAKE middleware to ensure only logged-in users can access this route and ensure this connects to SERVER.JS info
router.get('/user', memberMiddleware, getUserProfile);

//TODO FIGURE OUT WHY THIS FUCKING THING ISNT CONNECTING AND HAD TO BE COMMENTED OUT TO STARt the SERVER
//router.put('/settings', memberMiddleware, updateUserProfile);

module.exports = router;