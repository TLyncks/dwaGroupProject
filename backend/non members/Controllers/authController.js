// controllers/authController.js

const db = require('../../config/database.js');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');




//preventing bruteforce and time limit on session i think
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { error: 'Too many login attempts. Please try again later.' },
});

exports.loginLimiter = loginLimiter;
exports.login = async (req, res) => {
  const { email, password } = req.body

  
  if (!email || !password) {
    return res.status(400).json({ error: 'Both email and password are required.' })
  }

  try {

    // 1) Check if user exists
    const [rows] = await db.pool.query('SELECT * FROM baseuser WHERE userEmail = ?', [email])

    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found.' })
    }
    console.log('User data from DB:', rows[0]); 

    const user = rows[0]

    // 2) Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' })
    }


    
    req.session.userId = user.memberID;
    req.session.role = user.role;
    req.session.cookie.maxAge = 1000 * 60 * 30;


    console.log('req.session.userId', req.session.userId);
    // Determine the message based on role
    const message = user.role === 'admin' ? 'Hello admin!' : 'Login successful!'

    return res.json({
      message: message,

      userId: user.memberID, 
      role: user.role,  // so front-end knows if user is admin
    });

  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal server error.' })
  }
}


exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err)
      return res.status(500).json({ error: 'Could not log out.' })
    }
   

    return res.json({ message: 'Logged out successfully!' })
  })
}