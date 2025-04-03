module.exports = (req, res, next) => {
  console.log('Session:', req.session); //TODO debuggggggg as this is not allowing the user to access their data here
    if (!req.session || !req.session.userId) {
      console.log('❌ Unauthorized: No session or userId found');
      
      return res.status(401).json({ error: 'Unauthorized access' });
    }
    next(); 
  };