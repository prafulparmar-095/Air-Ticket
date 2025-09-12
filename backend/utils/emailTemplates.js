const bookingConfirmationTemplate = (booking, user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; }
        .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Flight Booking Confirmation</h1>
        </div>
        
        <div class="content">
          <p>Dear ${user.name},</p>
          <p>Your flight booking has been confirmed. Here are your booking details:</p>
          
          <div class="booking-details">
            <h2>Booking Reference: ${booking.bookingReference}</h2>
            <p><strong>Flight:</strong> ${booking.flight.origin} to ${booking.flight.destination}</p>
            <p><strong>Date:</strong> ${new Date(booking.flight.departureTime).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(booking.flight.departureTime).toLocaleTimeString()}</p>
            <p><strong>Passengers:</strong> ${booking.passengers.length}</p>
            <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
          </div>
          
          <p>Thank you for choosing our service. Have a pleasant journey!</p>
        </div>
        
        <div class="footer">
          <p>If you have any questions, please contact our support team at support@skybooker.com</p>
          <p>© 2023 SkyBooker. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

module.exports = {
  bookingConfirmationTemplate
}