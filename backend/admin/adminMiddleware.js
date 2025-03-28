// admin/middleware/adminMiddleware.js
exports.checkAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  };
  