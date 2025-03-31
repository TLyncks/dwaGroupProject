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

// NEW: Join event endpoint:
router.post('/:id/join', eventController.joinEvent);

// Create, update, delete endpoints:
router.post('/', upload.single('file'), eventController.createEvent);
router.put('/:id', upload.single('file'), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
