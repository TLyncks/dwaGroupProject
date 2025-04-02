// controllers/authController.js
const db = require('../../config/database.js')
const bcrypt = require('bcrypt')

/**
 * POST /login
 * Logs a user in using session-based auth.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Both email and password are required.' })
  }

  try {
    // 1) Check if user exists
    const [rows] = await db.pool.query('SELECT * FROM baseuser WHERE userEmail = ?', [email])
    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found.' })
    }

    const user = rows[0]

    // 2) Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' })
    }

    // 3) If valid, store user ID & role in session
    //    (Assuming you have a 'role' column in baseuser with 'user' or 'admin')
    //malcolm changed below from user.id to user.memberID. id in mysql is just numbering, while memberID is the user's unique member ID.
    req.session.userId = user.memberID
    req.session.role = user.role // e.g. 'admin' or 'user'

    // Determine the message based on role
    const message = user.role === 'admin' ? 'Hello admin!' : 'Login successful!'

    return res.json({
      message: message,
      userId: user.id,
      role: user.role // so front-end knows if user is admin
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal server error.' })
  }
}

/**
 * POST /logout
 * Logs a user out by destroying the session.
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err)
      return res.status(500).json({ error: 'Could not log out.' })
    }
    // If you’re using cookies, you might also want to clear them:
    // res.clearCookie('connect.sid');

    return res.json({ message: 'Logged out successfully!' })
  })
}
