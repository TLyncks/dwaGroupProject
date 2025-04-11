const db = require('../../config/database.js')

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.pool.query('SELECT * FROM calendar')
    rows.forEach((row) => {
      if (row.start_date) row.start_date = row.start_date.toISOString().split('T')[0];
      if (row.end_date) row.end_date = row.end_date.toISOString().split('T')[0];
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get event by ID
exports.getEventById = async (req, res) => {
  const eventId = req.params.id
  try {
    const [rows] = await db.pool.query('SELECT * FROM calendar WHERE event_id = ?', [eventId])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' })
    }
    const event = rows[0];
    if (event.start_date) event.start_date = event.start_date.toISOString().split('T')[0];
    if (event.end_date) event.end_date = event.end_date.toISOString().split('T')[0];
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get event attendees
exports.getEventAttendees = async (req, res) => {
  const eventId = req.params.id
  try {
    const [rows] = await db.pool.query(
      `SELECT baseuser.UserName, baseuser.userEmail, baseuser.UserPhone 
       FROM eventattendees ea
       JOIN baseuser ON ea.user_id = baseuser.id 
       WHERE ea.event_id = ?`,
      [eventId]
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const sql = `INSERT INTO calendar(title, user_id, description, image_url, start_date, end_date, start_time, end_time, recurrence, visibility)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const [result] = await db.pool.query(sql, [req.body.title, req.body.user_id, req.body.description, req.file.filename, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.recurrence, req.body.visibility])
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

// Update an event
exports.updateEvent = async (req, res) => {
  const eventId = req.params.id
  try {
    const sql = 'UPDATE Calendar SET title = ?, description = ?, ' + (req.file ? 'image_url = ?,' : '') + ' start_date = ?, end_date = ?, start_time = ?, end_time = ?, recurrence = ?, visibility = ? WHERE event_id = ?';
    const fields = [req.body.title, req.body.description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.recurrence, req.body.visibility, eventId];
    if (req.file) fields.splice(2, 0, req.file.filename);
    const [result] = await db.pool.query(sql, fields);
    res.json(result);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

// Delete an event
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id
  try {
    const [result] = await db.pool.query('DELETE FROM calendar WHERE event_id = ?', [eventId])
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

exports.createEventAttendee = async (req, res) => {
  const eventId = req.params.id;
  const memberID = req.body.userId; // This is what you get from the front end
  try {
    // Look up the actual primary key
    const [rows] = await db.pool.query('SELECT id FROM baseuser WHERE memberID = ?', [memberID]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userId = rows[0].id; // the primary key that the FK expects
    const sql = 'INSERT INTO eventattendees(event_id, user_id) VALUES (?, ?)';
    console.log(sql, eventId, userId);
    const [result] = await db.pool.query(sql, [eventId, userId]);

    const updateSql = 'UPDATE baseuser SET eventsAttended = eventsAttended + 1 WHERE memberID = ?'; //this was added by malcolm
    await db.pool.query(updateSql, [userId]); //this was added by malcolm


    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

