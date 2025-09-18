const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates
const emailTemplates = {
  welcome: {
    subject: 'Welcome to SkyWing Airlines!',
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to SkyWing Airlines</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .footer { background: #333; color: white; padding: 10px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to SkyWing Airlines!</h1>
        </div>
        <div class="content">
            <h2>Hello {{firstName}}!</h2>
            <p>Thank you for registering with SkyWing Airlines. We're excited to have you on board!</p>
            <p>Your account has been successfully created and you can now start booking flights with us.</p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 SkyWing Airlines. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
  },

  bookingConfirmation: {
    subject: 'Your Flight Booking Confirmation - SkyWing Airlines',
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .booking-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { background: #333; color: white; padding: 10px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmed!</h1>
        </div>
        <div class="content">
            <h2>Hello {{firstName}} {{lastName}},</h2>
            <p>Your flight booking has been confirmed. Here are your booking details:</p>
            
            <div class="booking-details">
                <h3>Booking Reference: <strong>{{bookingReference}}</strong></h3>
                <p><strong>Flight:</strong> {{flightNumber}} ({{airline}})</p>
                <p><strong>Route:</strong> {{origin}} → {{destination}}</p>
                <p><strong>Departure:</strong> {{departureTime}}</p>
                <p><strong>Arrival:</strong> {{arrivalTime}}</p>
                <p><strong>Passengers:</strong> {{passengerCount}}</p>
                <p><strong>Total Amount:</strong> \${{totalAmount}}</p>
            </div>

            <p>You can view your booking details and manage your trip from your account dashboard.</p>
            <p>Safe travels!</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 SkyWing Airlines. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
  },

  passwordReset: {
    subject: 'Password Reset Request - SkyWing Airlines',
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .button { background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        .footer { background: #333; color: white; padding: 10px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset</h1>
        </div>
        <div class="content">
            <h2>Hello {{firstName}},</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <p style="text-align: center;">
                <a href="{{resetLink}}" class="button">Reset Password</a>
            </p>
            
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>This link will expire in 1 hour for security reasons.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 SkyWing Airlines. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
  }
};

// Function to replace template variables
const replaceTemplateVariables = (template, variables) => {
  let html = template;
  for (const [key, value] of Object.entries(variables)) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return html;
};

// Send email function
const sendEmail = async (to, templateName, variables) => {
  try {
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    const html = replaceTemplateVariables(template.html, variables);
    const subject = replaceTemplateVariables(template.subject, variables);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  emailTemplates
};