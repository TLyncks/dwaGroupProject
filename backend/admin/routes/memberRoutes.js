// backend/admin/routes/eventRoutes.js
const express = require('express')
const router = express.Router()
const memberController = require('../controllers/memberController.js')

// Showcase endpoints:
router.get('/', memberController.getMembers)
router.get('/:id', memberController.getMemberById)

// Create, update, delete (if needed)
router.post('/', memberController.createMember)
router.put('/:id', memberController.updateMember)
router.delete('/:id', memberController.deleteMember)
router.get('/:id/attendees', memberController.getEventAttendees)

module.exports = router
