const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    reminderDate: { type: Date, required: true },
    reminderTime: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'sent'], default: 'pending' },
    // Other fields as needed
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
