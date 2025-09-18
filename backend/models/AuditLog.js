const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'login', 'logout', 'payment', 'refund']
  },
  entity: {
    type: String,
    required: true,
    enum: ['user', 'flight', 'booking', 'payment', 'auth']
  },
  entityId: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  changes: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ timestamp: -1 });

// Static method to log actions
auditLogSchema.statics.log = function(action, entity, entityId, userId, changes = {}, ipAddress = '', userAgent = '') {
  return this.create({
    action,
    entity,
    entityId,
    userId,
    changes,
    ipAddress,
    userAgent
  });
};

module.exports = mongoose.model('AuditLog', auditLogSchema);