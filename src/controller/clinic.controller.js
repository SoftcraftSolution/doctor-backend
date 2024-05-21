const Clinic = require('../model/clicnic.model');

exports.addClinic = async (req, res) => {
    try {
        // Receive clinic information from the request body
        const { name, location, contactDetails } = req.body;

        // Create a new clinic instance
        const newClinic = new Clinic({
            name,
            location,
            contactDetails
            // Other fields if needed
        });

        // Save the clinic to the database
        await newClinic.save();

        res.status(201).json({ message: 'Clinic added successfully', clinic: newClinic });
    } catch (err) {
        console.error('Error adding clinic:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
