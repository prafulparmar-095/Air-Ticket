const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateBookingTicket = async (booking, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      
      // Add header
      doc
        .fillColor('#1a56db')
        .fontSize(20)
        .text('Air India', 50, 50)
        .fontSize(10)
        .text('Booking Confirmation', 50, 75);
      
      // Add booking details
      doc
        .fillColor('#000000')
        .fontSize(16)
        .text(`Booking Reference: ${booking.bookingReference}`, 50, 120)
        .fontSize(12)
        .text(`Flight: ${booking.flight.flightNumber}`, 50, 150)
        .text(`From: ${booking.flight.departure.city} (${booking.flight.departure.airport})`, 50, 170)
        .text(`To: ${booking.flight.arrival.city} (${booking.flight.arrival.airport})`, 50, 190)
        .text(`Departure: ${new Date(booking.flight.departure.datetime).toLocaleString()}`, 50, 210)
        .text(`Arrival: ${new Date(booking.flight.arrival.datetime).toLocaleString()}`, 50, 230);
      
      // Add passenger details
      doc
        .text('Passengers:', 50, 270)
        .fontSize(10);
      
      booking.passengers.forEach((passenger, index) => {
        const y = 290 + (index * 40);
        doc
          .text(`${passenger.firstName} ${passenger.lastName}`, 70, y)
          .text(`Seat: ${passenger.seat.number} (${passenger.seat.class})`, 70, y + 15);
      });
      
      // Add footer
      doc
        .fontSize(8)
        .text('Thank you for choosing Air India!', 50, 500)
        .text('For any queries, contact: support@airindia.com', 50, 515);
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const generateInvoice = async (payment, booking, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      
      // Add header
      doc
        .fillColor('#1a56db')
        .fontSize(20)
        .text('Air India', 50, 50)
        .fontSize(10)
        .text('Invoice', 50, 75);
      
      // Add invoice details
      doc
        .fillColor('#000000')
        .fontSize(12)
        .text(`Invoice Number: ${payment.transactionId}`, 50, 120)
        .text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 50, 140)
        .text(`Customer: ${user.firstName} ${user.lastName}`, 50, 160)
        .text(`Email: ${user.email}`, 50, 180);
      
      // Add booking details
      doc
        .text(`Booking Reference: ${booking.bookingReference}`, 50, 220)
        .text(`Flight: ${booking.flight.flightNumber}`, 50, 240);
      
      // Add payment details
      doc
        .text('Payment Details:', 50, 280)
        .text(`Amount: $${payment.amount}`, 70, 300)
        .text(`Payment Method: ${payment.paymentMethod}`, 70, 320)
        .text(`Status: ${payment.paymentStatus}`, 70, 340);
      
      // Add footer
      doc
        .fontSize(8)
        .text('This is an automated invoice. No signature required.', 50, 450)
        .text('For any billing queries, contact: billing@airindia.com', 50, 465);
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateBookingTicket,
  generateInvoice
};