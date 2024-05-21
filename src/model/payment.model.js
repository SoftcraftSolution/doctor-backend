const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    // Other fields as needed
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
