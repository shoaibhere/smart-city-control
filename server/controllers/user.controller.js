import User from '../models/users.model.js';
import Department from '../models/department.js';

// @desc    Toggle user active status (Admin only)
// @route   PUT /api/users/:id/toggle
export const toggleUserActiveStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? 'reactivated' : 'deactivated'} successfully`,
      isActive: user.isActive,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'department') {
      query = { role: 'citizen' };
    }

    // Exclude the currently logged-in usera
    query._id = { $ne: req.user._id };

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Create user (Admin only)
// @route   POST /api/users
export const createUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { username, email, password, role, department, firstName, lastName } = req.body;

    // Check department exists if role is department
    if (role === 'department') {
      const dept = await Department.findById(department);
      if (!dept) {
        return res.status(400).json({ message: 'Department not found' });
      }
    }

    const user = new User({
      username,
      email,
      password,
      role,
      department: role === 'department' ? department : null,
      profile: { firstName, lastName }
    });

    await user.save();

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { role, department } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate department if role is department
    if (role === 'department') {
      const dept = await Department.findById(department);
      if (!dept) {
        return res.status(400).json({ message: 'Department not found' });
      }
      user.department = department;
    } else {
      user.department = null;
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(user._id);
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};