const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()
const eventController = require('../controllers/eventController')

const storage = multer.diskStorage({
  destination: './backend/uploads', // Save files in 'uploads' folder
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

router.get('/', eventController.getEvents)
router.get('/:id', eventController.getEventById)
router.post('/', upload.single('file'), eventController.createEvent)
router.put('/:id', upload.single('file'), eventController.updateEvent)
router.delete('/:id', eventController.deleteEvent)

module.exports = router
