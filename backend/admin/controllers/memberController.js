const db = require('../../config/database.js')
const bcrypt = require('bcrypt')

exports.getMembers = async (req, res) => {
  try {
    const [rows] = await db.pool.query('SELECT * FROM baseuser')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getMemberById = async (req, res) => {
  const memberId = req.params.id
  try {
    const [rows] = await db.pool.query('SELECT * FROM baseuser WHERE id = ?', [memberId])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' })
    }
    const member = rows[0]
    res.json(member)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const generateMemberID = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

exports.createMember = async (req, res) => {
  try {
    const { username, userEmail, userPassword, userPhone, address, role, status, membershipType, basedOn, tag, isKeyMember } = req.body

    const [existingUsers] = await db.pool.query('SELECT * FROM baseuser WHERE userEmail = ?', [userEmail])
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    let memberID = generateMemberID()
    let attempts = 0
    let isUnique = false
    while (attempts < 5 && !isUnique) {
      const [rows] = await db.pool.query('SELECT * FROM baseuser WHERE memberID = ?', [memberID])
      if (rows.length === 0) {
        isUnique = true
      } else {
        memberID = generateMemberID()
        attempts++
      }
    }
    if (!isUnique) {
      return res.status(500).json({ error: 'Failed to generate unique member ID' })
    }

    // Hash the password
    const password_hash = await bcrypt.hash(userPassword, 10)
    const sql = `INSERT INTO baseuser(UserName, userEmail, password_hash, UserPhone, UserAddress, isKeyMember, role, membershipType, basedOn, tag, status, memberID)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const [result] = await db.pool.query(sql, [username, userEmail, password_hash, userPhone, address, isKeyMember ? 1 : 0, role, membershipType, basedOn, tag, status, memberID])
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

exports.updateMember = async (req, res) => {
  const memberId = req.params.id
  const { username, userEmail, userPassword, userPhone, address, role, status, membershipType, basedOn, tag, isKeyMember } = req.body
  try {
    let password_hash = ''
    if (userPassword) password_hash = await bcrypt.hash(userPassword, 10)

    const sql = 'UPDATE baseuser SET UserName = ?, userEmail = ?, ' + (password_hash ? 'password_hash = ?,' : '') + ' UserPhone = ?, UserAddress = ?, isKeyMember = ?, role = ?, membershipType = ?, basedOn = ?, tag = ?, status = ? WHERE id = ?'
    const fields = [username, userEmail, userPhone, address, isKeyMember ? 1 : 0, role, membershipType, basedOn, tag, status, memberId]
    if (password_hash) fields.splice(2, 0, password_hash)
    const [result] = await db.pool.query(sql, fields)
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

exports.deleteMember = async (req, res) => {
  const userId = req.params.id
  try {
    const [result] = await db.pool.query('DELETE FROM baseuser WHERE id = ?', [userId])
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

exports.getEventAttendees = async (req, res) => {
  const memberId = req.params.id
  try {
    const [rows] = await db.pool.query(
      `SELECT bu.UserName, ca.title, ca.start_date, ca.start_time, ca.end_time, ea.status
       FROM eventattendees ea
       JOIN baseuser bu ON ea.user_id = bu.id
       JOIN calendar ca ON ea.event_id = ca.event_id
       WHERE ea.user_id = ? ORDER BY ca.start_date DESC`,
      [memberId]
    )
    rows.forEach((row) => {
      if (row.start_date) row.start_date = row.start_date.toISOString().split('T')[0]
      if (row.end_date) row.end_date = row.end_date.toISOString().split('T')[0]
    })
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
