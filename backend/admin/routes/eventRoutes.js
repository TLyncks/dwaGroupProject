// backend/admin/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './backend/uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Showcase endpoints:
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Admin report endpoint:
router.get('/:id/attendees', eventController.getEventAttendees);

// Create, update, delete (if needed)
router.post('/', upload.single('file'), eventController.createEvent);
router.put('/:id', upload.single('file'), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Route to join an event
router.post('/:id/join', eventController.createEventAttendee);

module.exports = router;
