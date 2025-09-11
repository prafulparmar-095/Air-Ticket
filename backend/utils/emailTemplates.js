// Welcome email template
const welcomeEmail = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to SkyBook!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Thank you for registering with SkyBook. We're excited to have you on board!</p>
          <p>With SkyBook, you can:</p>
          <ul>
            <li>Book flights to amazing destinations</li>
            <li>Get the best prices guaranteed</li>
            <li>Enjoy secure and easy payments</li>
            <li>Manage your bookings online</li>
          </ul>
          <p>Start exploring and book your next adventure today!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SkyBook. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Booking confirmation email template
const bookingConfirmationEmail = (name, booking) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .booking-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Your flight booking has been confirmed. Here are your booking details:</p>
          
          <div class="booking-details">
            <h3>Flight Details</h3>
            <p><strong>Flight:</strong> ${booking.flight.airline} - ${booking.flight.flightNumber}</p>
            <p><strong>From:</strong> ${booking.flight.departure.city} (${booking.flight.departure.code})</p>
            <p><strong>To:</strong> ${booking.flight.arrival.city} (${booking.flight.arrival.code})</p>
            <p><strong>Departure:</strong> ${new Date(booking.flight.departure.time).toLocaleString()}</p>
            <p><strong>Passengers:</strong> ${booking.passengers.length}</p>
            <p><strong>Total Amount:</strong> ₹${booking.totalPrice}</p>
          </div>
          
          <p>Thank you for choosing SkyBook. Have a great journey!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SkyBook. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = { welcomeEmail, bookingConfirmationEmail };