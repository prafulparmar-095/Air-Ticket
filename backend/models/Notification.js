const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedEntity: {
    type: String,
    enum: ['booking', 'flight', 'payment', 'user']
  },
  relatedEntityId: mongoose.Schema.Types.ObjectId
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);