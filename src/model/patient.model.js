// Required module
const mongoose = require('mongoose');

// Define patient schema
const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    patientNumber: {
        type: Number,
    },
    waitTime: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'scheduled' // Default status can be 'scheduled'
    }
    // Add any other fields as needed
}, { timestamps: true });

// Create Patient model
const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
