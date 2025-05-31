import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';

export const protect = async (req, res, next) => {
  let token;

  // Check both header and cookies
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please login again' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Flexible role checker
export const role = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role?.toLowerCase())) {
      return res.status(403).json({ 
        message: `Access restricted to: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
};

// Specific role checkers (optional, for backward compatibility)
export const admin = role('admin');
export const citizen = role('citizen');
export const department = role('department');