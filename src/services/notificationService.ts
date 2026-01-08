import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

// Initialize Firebase Admin
const app = initializeApp();
const db = getFirestore();

// Initialize Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const ADMIN_PHONE_NUMBERS = ['+918008380083', '+917993979939'];
const ADMIN_EMAILS = ['upadrastaharsha08@gmail.com', 'contactrutvikservices@gmail.com'];

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

/**
 * Sends an email notification to the admin emails.
 * @param subject - The subject of the email.
 * @param text - The body of the email.
 */
async function sendEmailNotification(subject: string, text: string): Promise<void> {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: ADMIN_EMAILS.join(', '),
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

/**
 * Triggered when a new booking is created in Firestore.
 */
export const sendBookingNotification = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();

    try {
      // Send SMS to all admin numbers
      const messagePromises = ADMIN_PHONE_NUMBERS.map(phoneNumber =>
        twilioClient.messages.create({
          body: `New booking received!\n\nService: ${booking.poojaType}\nDate: ${booking.date}\nTime: ${booking.time}\nStatus: ${booking.status}`,
          to: phoneNumber,
          from: process.env.TWILIO_PHONE_NUMBER
        })
      );

      await Promise.all(messagePromises);
      console.log('SMS notifications sent successfully');

      // Send email notification
      await sendEmailNotification(
        'New Booking Received - Rutvik Services',
        `New booking details:\n\nService: ${booking.poojaType}\nDate: ${booking.date}\nTime: ${booking.time}\nStatus: ${booking.status}\n\nCustomer Details:\nName: ${booking.userName}\nEmail: ${booking.userEmail}\nPhone: ${booking.userPhone || 'Not provided'}`
      );
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  });

/**
 * Triggered when a new custom request is created in Firestore.
 */
export const sendCustomRequestNotification = functions.firestore
  .document('customRequests/{requestId}')
  .onCreate(async (snap, context) => {
    const request = snap.data();

    try {
      // Send SMS to all admin numbers
      const messagePromises = ADMIN_PHONE_NUMBERS.map(phoneNumber =>
        twilioClient.messages.create({
          body: `New custom request received!\n\nPooja: ${request.poojaName}\nCategory: ${request.category}\nDate: ${request.date}\nTime: ${request.time}`,
          to: phoneNumber,
          from: process.env.TWILIO_PHONE_NUMBER
        })
      );

      await Promise.all(messagePromises);
      console.log('SMS notifications sent successfully');

      // Send email notification
      await sendEmailNotification(
        'New Custom Request Received - Rutvik Services',
        `New custom request details:\n\nPooja: ${request.poojaName}\nCategory: ${request.category}\nDate: ${request.date}\nTime: ${request.time}\n\nRequirements: ${request.requirements}\nAdditional Notes: ${request.additionalNotes || 'None'}`
      );
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  });




//working but google auth not working 
// import { initializeApp } from 'firebase-admin';
// import { getFirestore } from 'firebase-admin/firestore';
// import * as functions from 'firebase-functions';
// import twilio from 'twilio';
// import nodemailer from 'nodemailer';

// // Initialize Firebase Admin
// const app = initializeApp();
// const db = getFirestore();

// // Initialize Twilio
// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// const ADMIN_PHONE_NUMBERS = ['+918008363854', '+917993924499'];
// const ADMIN_EMAILS = ['upadrastaharsha09@gmail.com', 'contactrutvikservices@gmail.com'];

// // Create nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD
//   }
// });

// async function sendEmailNotification(subject: string, text: string) {
//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to: ADMIN_EMAILS.join(', '),
//     subject,
//     text
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email notification sent successfully');
//   } catch (error) {
//     console.error('Error sending email notification:', error);
//   }
// }

// export const sendBookingNotification = functions.firestore
//   .document('bookings/{bookingId}')
//   .onCreate(async (snap, context) => {
//     const booking = snap.data();
    
//     try {
//       // Send SMS to all admin numbers
//       const messagePromises = ADMIN_PHONE_NUMBERS.map(phoneNumber =>
//         twilioClient.messages.create({
//           body: `New booking received!\n\nService: ${booking.poojaType}\nDate: ${booking.date}\nTime: ${booking.time}\nStatus: ${booking.status}`,
//           to: phoneNumber,
//           from: process.env.TWILIO_PHONE_NUMBER
//         })
//       );

//       await Promise.all(messagePromises);
//       console.log('SMS notifications sent successfully');

//       // Send email notification
//       await sendEmailNotification(
//         'New Booking Received - Rutvik Services',
//         `New booking details:\n\nService: ${booking.poojaType}\nDate: ${booking.date}\nTime: ${booking.time}\nStatus: ${booking.status}\n\nCustomer Details:\nName: ${booking.userName}\nEmail: ${booking.userEmail}\nPhone: ${booking.userPhone || 'Not provided'}`
//       );
      
//     } catch (error) {
//       console.error('Error sending notifications:', error);
//     }
//   });

// export const sendCustomRequestNotification = functions.firestore
//   .document('customRequests/{requestId}')
//   .onCreate(async (snap, context) => {
//     const request = snap.data();
    
//     try {
//       // Send SMS to all admin numbers
//       const messagePromises = ADMIN_PHONE_NUMBERS.map(phoneNumber =>
//         twilioClient.messages.create({
//           body: `New custom request received!\n\nPooja: ${request.poojaName}\nCategory: ${request.category}\nDate: ${request.date}\nTime: ${request.time}`,
//           to: phoneNumber,
//           from: process.env.TWILIO_PHONE_NUMBER
//         })
//       );

//       await Promise.all(messagePromises);
//       console.log('SMS notifications sent successfully');

//       // Send email notification
//       await sendEmailNotification(
//         'New Custom Request Received - Rutvik Services',
//         `New custom request details:\n\nPooja: ${request.poojaName}\nCategory: ${request.category}\nDate: ${request.date}\nTime: ${request.time}\n\nRequirements: ${request.requirements}\nAdditional Notes: ${request.additionalNotes || 'None'}`
//       );
      
//     } catch (error) {
//       console.error('Error sending notifications:', error);
//     }
//   });