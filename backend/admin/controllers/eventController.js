const db = require('../../config/database.js');

exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.pool.query('SELECT * FROM Calendar');
    rows.forEach((row) => {
      if (row.start_date) row.start_date = row.start_date.toISOString().split('T')[0];
      if (row.end_date) row.end_date = row.end_date.toISOString().split('T')[0];
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  const eventId = req.params.id;
  try {
    const [rows] = await db.pool.query('SELECT * FROM Calendar WHERE event_id = ?', [eventId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    const event = rows[0];
    if (event.start_date) event.start_date = event.start_date.toISOString().split('T')[0];
    if (event.end_date) event.end_date = event.end_date.toISOString().split('T')[0];
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const sql = 'UPDATE Calendar SET title = ?, description = ?, ' + (req.file ? 'image_url = ?,' : '') + ' start_date = ?, end_date = ?, start_time = ?, end_time = ?, recurrence = ?, visibility = ? WHERE event_id = ?';
    const fields = [req.body.title, req.body.description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.recurrence, req.body.visibility, eventId];
    if (req.file) fields.splice(2, 0, req.file.filename);
    const [result] = await db.pool.query(sql, fields);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

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
