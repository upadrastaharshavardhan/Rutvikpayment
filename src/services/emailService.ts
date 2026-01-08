import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface EmailNotification {
  to: string[];
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmailNotification(notification: EmailNotification) {
  try {
    // Store the email notification in Firestore
    // This will trigger a Cloud Function to send the actual email
    await addDoc(collection(db, 'mail'), {
      to: notification.to,
      subject: notification.subject,
      text: notification.text,
      html: notification.html,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    
    return true;
  } catch (error) {
    console.error('Error creating email notification:', error);
    throw error;
  }
}

export async function sendBookingNotification(booking: any) {
  const adminEmails = ['contactrutvikservices@gmail.com', 'upadrastaharsha08@gmail.com'];
  
  const notification: EmailNotification = {
    to: adminEmails,
    subject: 'New Booking Received - Rutvik Services',
    text: `
New booking details:

Service: ${booking.poojaType}
Date: ${booking.date}
Time: ${booking.time}
Status: ${booking.status}

Customer Details:
Name: ${booking.userName || 'Not provided'}
Email: ${booking.userEmail || 'Not provided'}
Phone: ${booking.userPhone || 'Not provided'}

Requirements: ${booking.requirements || 'None'}
    `.trim(),
    html: `
      <h2 style="color: #333;">New Booking Received</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
        <h3 style="color: #e65100;">Booking Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Service:</strong> ${booking.poojaType}</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time:</strong> ${booking.time}</li>
          <li><strong>Status:</strong> <span style="color: #ff9800;">${booking.status}</span></li>
        </ul>
        
        <h3 style="color: #e65100;">Customer Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Name:</strong> ${booking.userName || 'Not provided'}</li>
          <li><strong>Email:</strong> ${booking.userEmail || 'Not provided'}</li>
          <li><strong>Phone:</strong> ${booking.userPhone || 'Not provided'}</li>
        </ul>
        
        <h3 style="color: #e65100;">Requirements:</h3>
        <p style="background-color: white; padding: 10px; border-radius: 4px;">${booking.requirements || 'None'}</p>
      </div>
    `
  };

  return sendEmailNotification(notification);
}