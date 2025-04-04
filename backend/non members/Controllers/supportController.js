// Controllers/supportController.js
const { pool } = require('../../config/database.js'); 

exports.submitSupportRequest = async (req, res) => {
  try {
    const { fullName, email, issueType, description } = req.body;

    const sql = `
      INSERT INTO support_request (full_name, email, issue_type, issue_description)
      VALUES (?, ?, ?, ?)
    `;
    await pool.query(sql, [fullName, email, issueType, description]);

    res.status(201).json({
      success: true,
      message: 'Support request submitted successfully.',
    });
  } catch (error) {
    console.error('Error inserting support request:', error);
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred. Please try again later.' 
      : error.message;
    res.status(500).json({ success: false, error: errorMessage });
  }
};
