// controllers/authController.js
const db = require('../../config/database.js');
const bcrypt = require('bcrypt');


exports.login = async (req, res) => {
  const { email, password } = req.body;

  //  validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Both email and password are required.' });
  }

  try {
    //  Check if user exists
    const [rows] = await db.pool.query(
      'SELECT * FROM BaseUser WHERE userEmail = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const user = rows[0];

    //  Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // If valid, store user ID & role in session
  
    req.session.userId = user.memberID;
    req.session.role = user.role; // e.g. 'admin' or 'user'

    // Determine the message based on role
    const message = user.role === 'admin' ? 'Hello admin!' : 'Login successful!';

    return res.json({
      message: message,
      userId: user.id,
      role: user.role,  // so front-end knows if user is admin
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Could not log out.' });
    }
   

    return res.json({ message: 'Logged out successfully!' });
  });
};
