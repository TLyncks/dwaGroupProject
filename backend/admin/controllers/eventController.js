const db = require('../../config/database.js')

exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.pool.query('SELECT * FROM Calendar')
    rows.forEach((row) => {
      row.start_date = row.start_date.toISOString().split('T')[0]
      row.end_date = row.end_date.toISOString().split('T')[0]
    })
    res.json({ events: rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getEventById = async (req, res) => {
  const eventId = req.params.id
  try {
    const [rows] = await db.pool.query('SELECT * FROM Calendar WHERE event_id = ?', [eventId])
    res.json({ event: rows.length ? { ...rows[0], start_date: rows[0].start_date.toISOString().split('T')[0], end_date: rows[0].end_date.toISOString().split('T')[0] } : null })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createEvent = async (req, res) => {
  try {
    const sql = 'INSERT INTO Calendar(title, description, image_url, start_date, end_date, start_time, end_time, recurrence, visibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    const [result, fields] = await db.pool.query(sql, [req.body.title, req.body.description, req.file.filename, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.recurrence, req.body.visibility])
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

exports.updateEvent = async (req, res) => {
  const eventId = req.params.id
  try {
    const sql = 'UPDATE Calendar SET title = ?, description = ?, ' + (req.file ? 'image_url = ?,' : '') + ' start_date = ?, end_date = ?, start_time = ?, end_time = ?, recurrence = ?, visibility = ? Where event_id = ?'
    const fields = [req.body.title, req.body.description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.recurrence, req.body.visibility, eventId]
    if (req.file) fields.splice(2, 0, req.file.filename)
    const [result] = await db.pool.query(sql, fields)
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id
  try {
    const [result] = await db.pool.query('DELETE FROM Calendar WHERE event_id = ?', [eventId])
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}
