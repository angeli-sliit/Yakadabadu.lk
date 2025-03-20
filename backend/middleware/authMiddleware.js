import jwt from 'jsonwebtoken';
import Driver from '../models/Driver.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      error: 'Not authorized, no token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentDriver = await Driver.findById(decoded.id).select('-password');
    
    if (!currentDriver) {
      return res.status(401).json({
        status: 'fail',
        error: 'The driver belonging to this token no longer exists'
      });
    }

    req.user = currentDriver;
    next();
  } catch (error) {
    let errorMessage = 'Not authorized, token failed';
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token expired, please login again';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token, please login again';
    }

    return res.status(401).json({
      status: 'fail',
      error: errorMessage
    });
  }
};

export { protect };