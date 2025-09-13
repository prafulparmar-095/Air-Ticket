// backend/utils/emailTemplates.js
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Booking confirmation template
exports.sendBookingConfirmation = async (booking, user) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: user.email,
    subject: `Booking Confirmation - ${booking.bookingReference}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a56db; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
          .flight-info { background: white; padding: 15px; border-radius: 5px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .info-label { font-weight: bold; color: #6b7280; }
          .passenger-list { margin-top: 15px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Flight Booking Confirmed</h1>
            <p>Your booking reference: <strong>${booking.bookingReference}</strong></p>
          </div>
          <div class="content">
            <div class="flight-info">
              <h2>Flight Details</h2>
              <div class="info-row">
                <span class="info-label">Flight Number:</span>
                <span>${booking.flight.number}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Route:</span>
                <span>${booking.flight.origin} to ${booking.flight.destination}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Departure:</span>
                <span>${new Date(booking.flight.departureTime).toLocaleString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Arrival:</span>
                <span>${new Date(booking.flight.arrivalTime).toLocaleString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Duration:</span>
                <span>${booking.flight.duration}</span>
              </div>
            </div>
            
            <div class="flight-info">
              <h2>Passenger Details</h2>
              ${booking.passengers.map(passenger => `
                <div class="passenger-list">
                  <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span>${passenger.firstName} ${passenger.lastName}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Seat:</span>
                    <span>${passenger.seat || 'Not assigned'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="flight-info">
              <h2>Payment Details</h2>
              <div class="info-row">
                <span class="info-label">Total Amount:</span>
                <span>$${booking.totalAmount}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Status:</span>
                <span>${booking.paymentStatus}</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for booking with us!</p>
              <p>If you have any questions, please contact our support team at support@airticket.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent to:', user.email);
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
  }
};

// Flight status update template
exports.sendFlightStatusUpdate = async (booking, user, flight, oldStatus, newStatus) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: user.email,
    subject: `Flight Status Update - ${flight.number}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a56db; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
          .flight-info { background: white; padding: 15px; border-radius: 5px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .info-label { font-weight: bold; color: #6b7280; }
          .status-update { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Flight Status Update</h1>
            <p>Your flight status has changed</p>
          </div>
          <div class="content">
            <div class="status-update">
              <h2>Status Change</h2>
              <p>Your flight status has changed from <strong>${oldStatus}</strong> to <strong>${newStatus}</strong></p>
            </div>
            
            <div class="flight-info">
              <h2>Flight Details</h2>
              <div class="info-row">
                <span class="info-label">Flight Number:</span>
                <span>${flight.number}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Route:</span>
                <span>${flight.origin} to ${flight.destination}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Departure:</span>
                <span>${new Date(flight.departureTime).toLocaleString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Arrival:</span>
                <span>${new Date(flight.arrivalTime).toLocaleString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Booking Reference:</span>
                <span>${booking.bookingReference}</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for flying with us!</p>
              <p>If you have any questions, please contact our support team at support@airticket.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Flight status update email sent to:', user.email);
  } catch (error) {
    console.error('Error sending flight status update email:', error);
  }
};

// Password reset template
exports.sendPasswordReset = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a56db; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; background: #1a56db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>You have requested to reset your password. Please click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If you did not request this password reset, please ignore this email.</p>
            <p>The password reset link will expire in 1 hour.</p>
            
            <div class="footer">
              <p>If you have any questions, please contact our support team at support@airticket.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', user.email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};