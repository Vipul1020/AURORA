const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const jwtSecret = process.env.JWT_SECRET;
       if (!jwtSecret) {
            console.error("JWT_SECRET not found in environment variables for verification.");
            return res.status(500).json({ message: "Server configuration error."})
        }
      const decoded = jwt.verify(token, jwtSecret);

      
      req.user = { id: decoded.userId, role: decoded.role }; 

      if (!req.user) {
           return res.status(401).json({ message: 'Not authorized, user not found' }); 
      }


      next(); 

    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
        next();
    };
};


module.exports = { protect, restrictTo };