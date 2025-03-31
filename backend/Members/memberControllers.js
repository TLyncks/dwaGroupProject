const db = require('../config/database.js');

// Controller to get user details
const getUserProfile = async (req, res) => {
  try {
    const userId = req.session.userId;      //TODO check which information is transfered over and used here

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [rows] = await db.pool.query('SELECT * FROM BaseUser WHERE memberID = ?', [userId]); //TODO needs to accurately take data from mysql
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    } 

    const user = rows[0];
    res.json({                              //TODO adjust depending on data taken from mysql
      fullName: user.UserName,
      email: user.userEmail,
      otherInfo: user.otherInfo || 'No additional info available'
     // profileImage: user.profileImage || null
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { username, name, email, company } = req.body;
  
      await db.query(
        'UPDATE users SET username = ?, name = ?, email = ?, company = ? WHERE id = ?',
        [username, name, email, company, userId]
      );
  
      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  module.exports = { getUserProfile, updateUserProfile };