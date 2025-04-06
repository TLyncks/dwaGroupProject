// backend/admin/routes/eventRoutes.js
const express = require('express')
const router = express.Router()
const membershipApplicationController = require('../controllers/membershipApplicationController.js')

// Showcase endpoints:
router.get('/', membershipApplicationController.getApplications)

// Create, update, delete (if needed)
router.post('/', membershipApplicationController.approveMember)
router.put('/:id/deny', membershipApplicationController.denyMember)

module.exports = router
