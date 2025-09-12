// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });
    
    // Generate verification token
    const verificationToken = user.getVerificationToken();
    await user.save({ validateBeforeSave: false });
    
    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
    
    // Send verification email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification - SkyBooker',
        message: `Please verify your email by clicking on the following link: ${verificationUrl}`
      });
      
      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification.',
        data: {
          token: generateToken(user._id),
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (emailError) {
      user.verificationToken = undefined;
      user.verificationExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone
    };
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    const isCurrentPasswordMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    
    if (!isCurrentPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = req.body.newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }
    
    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    
    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    
    // Send email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request - SkyBooker',
        message: `You are receiving this email because you requested a password reset. Please make a PUT request to: ${resetUrl}`
      });
      
      res.json({
        success: true,
        message: 'Email sent with password reset instructions'
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};