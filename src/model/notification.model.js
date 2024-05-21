const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming both Admins and Users can send notifications
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // Receiver can be a Patient or Doctor
    notificationType: { type: String, required: true },
    notificationDate: { type: Date, default: Date.now },
    message: { type: String },
    status: { type: String, enum: ['unread', 'read'], default: 'unread' },
    // Other fields as needed
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
