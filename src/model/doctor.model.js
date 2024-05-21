const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define Doctor schema
const doctorSchema =  new Schema({
    
    name: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    qualifications: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    clinicName: {
        type: String,
        required: true
    },
    clinicAddress: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    availability: {
        type: [String],
        required: true
    },
    imageUrl: {
        type: String // URL or reference to the doctor's image
    }
});

// Create Doctor model
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
