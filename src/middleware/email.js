// emailService.js

const nodemailer = require('nodemailer');

// Function to send delay notification via email
exports.sendDelayNotificationEmail = async (patient) => {
    try {
        // Check if patient is found and has patientNumber
        if (patient && patient.patientNumber) {
            // Code to send delay notification to the patient via email
            const transporter = nodemailer.createTransport({
                // Configure the SMTP transport
                service: 'gmail',
                auth: {
                    user: 'kannoujiaaryan@gmail.com',
                    pass: '9125608530'
                }
            });

            // Email message options
            const mailOptions = {
                from: 'kannoujiaaryan@gmail.com',
                to: patient.contactNumber,
                subject: 'Delay Notification',
                text: `Dear ${patient.name}, your appointment is delayed. Please expect a delay in your appointment time.`
            };

            // Send email
            await transporter.sendMail(mailOptions);

            // Log notification sent to console
            console.log('Delay notification sent to patient via email:', patient.contactNumber);
        } else {
            console.error('Patient or patientNumber is null or undefined');
        }
    } catch (err) {
        console.error('Error sending delay notification via email:', err);
    }
};
