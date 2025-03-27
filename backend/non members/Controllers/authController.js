// controllers/authController.js
const db = require('../../config/database.js');
const bcrypt = require('bcrypt');

/**
 * POST /login
 * Logs a user in using session-based auth.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Both email and password are required.' });
  }

  try {
    // Check if user exists
    const [rows] = await db.pool.query(
      'SELECT * FROM BaseUser WHERE userEmail = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const user = rows[0];

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // If valid, store user ID (or any relevant data) in session
    req.session.userId = user.id;
    // You could also store role or other info: req.session.role = user.role;

    return res.json({
      message: 'Login successful!',
      userId: user.id,
      // role: user.role, // if you have a role column
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /logout
 * Logs a user out by destroying the session.
 */
exports.logout = (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Could not log out.' });
    }
    // If you’re using cookies, you might also want to clear them:
    // res.clearCookie('connect.sid'); // default cookie name for express-session

    return res.json({ message: 'Logged out successfully!' });
  });
};
