const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Gmail Transporter Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "contactrutvikservices@gmail.com",      // Your Gmail
        pass: "krpl ytoc jrrt vrqt"   // Generate this from Gmail settings
    }
});

// Cloud Function to Send Email
exports.sendBookingEmail = functions.firestore
    .document("mail/{mailId}")  // Triggers when a new document is added to 'mail' collection
    .onCreate(async (snap, context) => {
        const data = snap.data();

        const mailOptions = {
            from: "contactrutvikservices@gmail.com",
            to: data.to,
            subject: data.subject,
            text: data.message
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent successfully to: ${data.to}`);
        } catch (error) {
            console.error(`❌ Error sending email: ${error}`);
        }
    });
