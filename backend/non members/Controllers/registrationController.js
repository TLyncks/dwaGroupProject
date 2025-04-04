const db = require('../../config/database.js')
const bcrypt = require('bcrypt')

// Helper function to generate a random 6-digit member ID
const generateMemberID = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

exports.signup = async (req, res) => {
  // Destructure phone from the request body
  const { fullName, email, phone, password } = req.body

  // Require fullName, email, phone, and password
  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    // Check if user already exists by email
    const [existingUsers] = await db.pool.query('SELECT * FROM baseuser WHERE userEmail = ?', [email])
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Generate a unique memberID
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
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Insert new user into baseuser table, including phone
    // Make sure your DB column is named "UserPhone" (or change it below)
    const sql = `
      INSERT INTO baseuser (UserName, userEmail, UserPhone, password_hash, memberID)
      VALUES (?, ?, ?, ?, ?)
    `
    const [result] = await db.pool.query(sql, [fullName, email, phone, password_hash, memberID])

    res.json({ message: 'Signup successful', userId: result.insertId })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: error.message })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Both email and password are required' })
  }

  try {
    // Find user by email
    const [rows] = await db.pool.query('SELECT * FROM baseuser WHERE userEmail = ?', [email])
    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found' })
    }

    const user = rows[0]

    // Compare the provided password with the stored password_hash
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    res.json({ message: 'Login successful', userId: user.id })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: error.message })
  }
}