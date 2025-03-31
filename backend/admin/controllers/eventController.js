const db = require('../../config/database.js');

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.pool.query('SELECT * FROM Calendar');
    rows.forEach((row) => {
      if (row.start_date)
        row.start_date = row.start_date.toISOString().split('T')[0];
      if (row.end_date)
        row.end_date = row.end_date.toISOString().split('T')[0];
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  const eventId = req.params.id;
  try {
    const [rows] = await db.pool.query('SELECT * FROM Calendar WHERE event_id = ?', [eventId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    const event = rows[0];
    if (event.start_date)
      event.start_date = event.start_date.toISOString().split('T')[0];
    if (event.end_date)
      event.end_date = event.end_date.toISOString().split('T')[0];
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get event attendees
exports.getEventAttendees = async (req, res) => {
  const eventId = req.params.id;
  try {
    const [rows] = await db.pool.query(
      `SELECT BaseUser.UserName, BaseUser.userEmail, BaseUser.UserPhone 
       FROM EventAttendees 
       JOIN BaseUser ON EventAttendees.user_id = BaseUser.id 
       WHERE EventAttendees.event_id = ?`,
      [eventId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const sql = `INSERT INTO Calendar(title, description, image_url, start_date, end_date, start_time, end_time, recurrence, visibility)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.pool.query(sql, [
      req.body.title,
      req.body.description,
      req.file.filename,
      req.body.start_date,
      req.body.end_date,
      req.body.start_time,
      req.body.end_time,
      req.body.recurrence,
      req.body.visibility
    ]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const sql =
      'UPDATE Calendar SET title = ?, description = ?, ' +
      (req.file ? 'image_url = ?,' : '') +
      ' start_date = ?, end_date = ?, start_time = ?, end_time = ?, recurrence = ?, visibility = ? WHERE event_id = ?';
    const fields = [
      req.body.title,
      req.body.description,
      req.body.start_date,
      req.body.end_date,
      req.body.start_time,
      req.body.end_time,
      req.body.recurrence,
      req.body.visibility,
      eventId
    ];
    if (req.file) fields.splice(2, 0, req.file.filename);
    const [result] = await db.pool.query(sql, fields);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const [result] = await db.pool.query('DELETE FROM Calendar WHERE event_id = ?', [eventId]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// NEW: Join an event
exports.joinEvent = async (req, res) => {
  const eventId = req.params.id;
  // Retrieve userId from the request body (ensure your front-end sends this)
  const { userId } = req.body;
  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  try {
    const [result] = await db.pool.query(
      'INSERT INTO EventAttendees (event_id, user_id, status) VALUES (?, ?, ?)',
      [eventId, userId, 'attending']
    );
    res.status(200).json({ message: "Joined event successfully", joinId: result.insertId });
  } catch (error) {
    console.error("Join event error:", error);
    res.status(500).json({ error: error.message });
  }
};
