const User = require('../models/User');
const Booking = require('../models/Booking');
const AuditLog = require('../models/AuditLog');

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    // Log the action
    await AuditLog.log('read', 'user', null, req.user._id, { search, page, limit }, req.ip, req.get('User-Agent'));
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Log the action
    await AuditLog.log('read', 'user', user._id, req.user._id, {}, req.ip, req.get('User-Agent'));
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated through this endpoint
    delete updates.password;
    delete updates.role;
    delete updates.isVerified;
    
    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Log the action
    await AuditLog.log('update', 'user', user._id, req.user._id, updates, req.ip, req.get('User-Agent'));
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Also delete user's bookings
    await Booking.deleteMany({ user: req.params.id });
    
    // Log the action
    await AuditLog.log('delete', 'user', user._id, req.user._id, {}, req.ip, req.get('User-Agent'));
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const bookings = await Booking.find({ user: id })
      .populate('flight')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Booking.countDocuments({ user: id });
    
    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete old image if exists
    if (user.profileImage && user.profileImage.publicId) {
      // Here you would typically delete the old image from Cloudinary
      // await cloudinary.uploader.destroy(user.profileImage.publicId);
    }
    
    user.profileImage = {
      url: req.file.path,
      publicId: req.file.filename
    };
    
    await user.save();
    
    // Log the action
    await AuditLog.log('update', 'user', user._id, req.user._id, { profileImage: user.profileImage }, req.ip, req.get('User-Agent'));
    
    res.json({
      message: 'Profile image uploaded successfully',
      profileImage: user.profileImage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserBookings,
  uploadProfileImage
};