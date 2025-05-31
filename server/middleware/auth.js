import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';

// 🔐 Protect Route (used as "protect")
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select('-password');

    if (!req.user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// ✅ Admin-only Access
export const admin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Admin access only' });
  }
  next();
};

// ✅ Citizen-only Access
export const citizen = (req, res, next) => {
  if (req.user.role !== 'Citizen') {
    return res.status(403).json({ msg: 'Citizen access only' });
  }
  next();
};

// ✅ Department Official-only Access
export const department = (req, res, next) => {
  if (req.user.role !== 'Department Official') {
    return res.status(403).json({ msg: 'Department Official access only' });
  }
  next();
};
