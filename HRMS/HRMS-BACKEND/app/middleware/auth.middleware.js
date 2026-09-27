const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Bearer token required' });
  }
  req.token = authHeader.split(' ')[1];
  next();
};

module.exports = authMiddleware;
