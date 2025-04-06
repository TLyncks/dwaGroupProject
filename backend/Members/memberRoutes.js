const express = require('express');
const router = express.Router();
const { getUserProfile } = require('./memberControllers');
const memberMiddleware = require('./memberMiddleware');
const {updateUserProfile} = require('./memberControllers')
const {updateUserPassword} = require('./memberControllers')
const {getUserProfileForDash} = require('./memberControllers')
const {getBenefitData} = require('./memberControllers')
const {updateBenefitProgress} = require('./memberControllers')

//MAKE SURE ANY FUNCTIONS USED BELOW ARE PROPERLY IMPORTED ABOVE!!!!

// TODO MAKE middleware to ensure only logged-in users can access this route and ensure this connects to SERVER.JS info
router.get('/user', memberMiddleware, getUserProfile);

//TODO add GET routes for chat, calendar, settings and digital content

router.get('/dashboard', memberMiddleware, getUserProfileForDash)

router.get('/settings', memberMiddleware, getUserProfile);

router.put('/settings', memberMiddleware, updateUserProfile);

router.put('/update-password', memberMiddleware, updateUserPassword);



router.get('/benefitProgress', memberMiddleware, getBenefitData);


router.post('/save-benefitProgress', memberMiddleware, updateBenefitProgress);

//router.get()

module.exports = router;  