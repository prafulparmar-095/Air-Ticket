const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');

// Create notification
const createNotification = async (userId, title, message, type = 'info', relatedEntity = null, relatedEntityId = null) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      relatedEntity,
      relatedEntityId
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send booking confirmation notification
const sendBookingConfirmation = async (userId, booking) => {
  try {
    const title = 'Booking Confirmed';
    const message = `Your booking ${booking.bookingReference} has been confirmed for flight ${booking.flight.flightNumber}`;
    
    await createNotification(
      userId,
      title,
      message,
      'success',
      'booking',
      booking._id
    );

    // Also send email
    await sendEmail({
      email: booking.contactEmail,
      subject: 'Booking Confirmation - Air India',
      template: 'bookingConfirmation',
      context: {
        name: `${booking.user.firstName} ${booking.user.lastName}`,
        bookingReference: booking.bookingReference,
        flightNumber: booking.flight.flightNumber,
        departure: booking.flight.departure,
        arrival: booking.flight.arrival,
        departureDate: new Date(booking.flight.departure.datetime).toLocaleDateString(),
        arrivalDate: new Date(booking.flight.arrival.datetime).toLocaleDateString(),
        duration: `${Math.floor(booking.flight.duration / 60)}h ${booking.flight.duration % 60}m`,
        passengers: booking.passengers,
        totalAmount: booking.totalAmount,
        paymentStatus: booking.paymentStatus
      }
    });
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    throw error;
  }
};

// Send payment notification
const sendPaymentNotification = async (userId, payment, booking) => {
  try {
    const title = `Payment ${payment.paymentStatus}`;
    const message = `Payment for booking ${booking.bookingReference} is ${payment.paymentStatus}. Amount: $${payment.amount}`;
    
    await createNotification(
      userId,
      title,
      message,
      payment.paymentStatus === 'completed' ? 'success' : 'error',
      'payment',
      payment._id
    );
  } catch (error) {
    console.error('Error sending payment notification:', error);
    throw error;
  }
};

// Send flight status update
const sendFlightStatusUpdate = async (userId, flight, oldStatus, newStatus) => {
  try {
    const title = 'Flight Status Update';
    const message = `Flight ${flight.flightNumber} status changed from ${oldStatus} to ${newStatus}`;
    
    await createNotification(
      userId,
      title,
      message,
      'info',
      'flight',
      flight._id
    );
  } catch (error) {
    console.error('Error sending flight status update:', error);
    throw error;
  }
};

// Get user notifications
const getUserNotifications = async (userId, page = 1, limit = 10, unreadOnly = false) => {
  try {
    const query = { user: userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments(query);

    return {
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );

    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );

    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Delete notification
const deleteNotification = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId
    });

    return notification;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  sendBookingConfirmation,
  sendPaymentNotification,
  sendFlightStatusUpdate,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};