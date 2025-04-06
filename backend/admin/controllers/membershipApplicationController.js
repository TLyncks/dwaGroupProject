const db = require('../../config/database.js')
const bcrypt = require('bcrypt')

exports.getApplications = async (req, res) => {
  try {
    const [rows] = await db.pool.query('SELECT * FROM membership_application WHERE status = "waiting"')
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

const generateId = async () => {
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

  return memberID
}

exports.approveMember = async (req, res) => {
  try {
    const { id, first_name, last_name, email, phone, membership_type, reason, heard_about, created_at } = req.body

    const [existingUsers] = await db.pool.query('SELECT * FROM baseuser WHERE userEmail = ?', [email])
    if (existingUsers.length > 0) return res.status(400).json({ error: 'User with this email already exists' })
    let memberID = await generateId()
    const membershipType = membership_type == 'creative_workspace' ? 'Workspace Member' : membership_type == 'key_access' ? 'Key Access Member' : 'Community Member'

    // Hash the password
    const password_hash = await bcrypt.hash('password', 10)
    const sql = `INSERT INTO baseuser(UserName, userEmail, password_hash, UserPhone, UserAddress, membershipType, status, memberID)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    const [result] = await db.pool.query(sql, [first_name + ' ' + last_name, email, password_hash, phone, 'Address', membershipType, 'Approved', memberID])
    res.json(result)

    await db.pool.query('UPDATE membership_application SET status = "Approved" WHERE id = ?', [id])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

exports.denyMember = async (req, res) => {
  const applicationId = req.params.id
  try {
    const [result] = await db.pool.query('UPDATE membership_application SET status = "Denied" WHERE id = ?', [applicationId])
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}
