module.exports = (req, res, next) => {
    // Confirm the session is properly configured
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }
    next(); 
  };