const express = require('express');
const router = express.Router();
const { getUserProfile } = require('./memberControllers');
const memberMiddleware = require('./memberMiddleware');
const {updateUserProfile} = require('./memberControllers')

//MAKE SURE ANY FUNCTIONS USED BELOW ARE PROPERLY IMPORTED ABOVE!!!!

// TODO MAKE middleware to ensure only logged-in users can access this route and ensure this connects to SERVER.JS info
router.get('/user', memberMiddleware, getUserProfile);


router.get('/settings', memberMiddleware, getUserProfile);

router.put('/settings', memberMiddleware, updateUserProfile);

module.exports = router;  