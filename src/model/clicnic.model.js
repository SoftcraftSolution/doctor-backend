const mongoose = require('mongoose');

// Define the schema for the clinic
const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    contactDetails: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }
});

// Create and export the Clinic model
module.exports = mongoose.model('Clinic', clinicSchema);
