const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const templates = {
  welcome: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a56db; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .footer { background: #e5e7eb; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Air India</h1>
        </div>
        <div class="content">
          <p>Dear {{name}},</p>
          <p>Thank you for creating an account with Air India! We're excited to have you on board.</p>
          <p>You can now book flights, manage your bookings, and enjoy exclusive member benefits.</p>
          <p>Happy travels!</p>
        </div>
        <div class="footer">
          <p>© 2024 Air India. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  bookingConfirmation: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a56db; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .footer { background: #e5e7eb; padding: 20px; text-align: center; }
        .booking-details { background: white; padding: 20px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Flight Booking Confirmed</h1>
        </div>
        <div class="content">
          <p>Dear {{name}},</p>
          <p>Your flight booking has been confirmed. Here are your booking details:</p>
          
          <div class="booking-details">
            <h3>Booking Reference: {{bookingReference}}</h3>
            <p><strong>Flight:</strong> {{flightNumber}}</p>
            <p><strong>From:</strong> {{departure.city}} ({{departure.airport}})</p>
            <p><strong>To:</strong> {{arrival.city}} ({{arrival.airport}})</p>
            <p><strong>Total Amount:</strong> ${{totalAmount}}</p>
          </div>
          
          <p>Thank you for choosing Air India!</p>
        </div>
        <div class="footer">
          <p>© 2024 Air India. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  passwordReset: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a56db; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .footer { background: #e5e7eb; padding: 20px; text-align: center; }
        .button { background: #1a56db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Dear {{name}},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <p style="text-align: center;">
            <a href="{{resetUrl}}" class="button">Reset Password</a>
          </p>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2024 Air India. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

const sendEmail = async ({ email, subject, template, context }) => {
  try {
    let html = templates[template];
    
    for (const [key, value] of Object.entries(context)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;