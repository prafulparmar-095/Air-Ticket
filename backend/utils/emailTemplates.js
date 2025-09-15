export const bookingConfirmationTemplate = (booking, user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
        .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .flight-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed!</h1>
        </div>
        
        <div class="content">
          <p>Dear ${user.name},</p>
          <p>Your flight booking has been confirmed. Here are your booking details:</p>
          
          <div class="booking-details">
            <h2>Booking Reference: ${booking.bookingReference}</h2>
            
            <div class="flight-info">
              <div>
                <strong>Flight:</strong><br>
                ${booking.flight.origin} → ${booking.flight.destination}<br>
                ${booking.flight.airline} ${booking.flight.flightNumber}
              </div>
              <div>
                <strong>Departure:</strong><br>
                ${new Date(booking.flight.departureTime).toLocaleDateString()} at ${new Date(booking.flight.departureTime).toLocaleTimeString()}
              </div>
            </div>
            
            <h3>Passengers:</h3>
            <ul>
              ${booking.passengers.map(p => `<li>${p.firstName} ${p.lastName} (${p.type})</li>`).join('')}
            </ul>
            
            <p><strong>Total Amount:</strong> ${formatCurrency(booking.totalAmount)}</p>
          </div>
          
          <p>You can view your booking details and download your e-ticket from your account.</p>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing our airline service!</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const passwordResetTemplate = (user, resetToken) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; }
        .button { background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
          <p>Dear ${user.name},</p>
          <p>You requested to reset your password. Click the button below to reset your password:</p>
          
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" class="button">
              Reset Password
            </a>
          </p>
          
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
        
        <div class="footer">
          <p>Thank you for using our service!</p>
        </div>
      </div>
    </body>
    </html>
  `
}