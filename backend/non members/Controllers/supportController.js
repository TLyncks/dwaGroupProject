// Controllers/supportController.js
const { pool } = require('../../config/database.js'); // Adjust path if needed

exports.submitSupportRequest = async (req, res) => {
  try {
    const { fullName, email, issueType, description } = req.body;

    // Insert the support request into the support_request table.
    // Ensure that the table and column names match your schema.
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
    res.status(500).json({
      success: false,
      error: 'An error occurred while submitting your support request.',
    });
  }
};
