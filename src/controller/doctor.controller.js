const cloudinary = require('cloudinary').v2; // Import Cloudinary
const Doctor = require('../model/doctor.model');

exports.addDoctor = async (req, res) => {
  try {
    // Log the request object to check if it contains the file
    console.log(req.file);

    // Check if req.file exists
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path); // Upload the image to Cloudinary
    const imageUrl = result.secure_url; // Get the secure URL of the uploaded image

    // Extract data from the request body
    const { name } = req.body;

    // Create a new doctor object with image URL
    const newDoctor = new Doctor({
      name,
     
      imageUrl, // Add the imageUrl to the doctor object
    });

    // Save the doctor object to the database
    const savedDoctor = await newDoctor.save();

    res.status(201).json({ message: 'Doctor added successfully', doctor: savedDoctor });
  } catch (error) {
    res.status(500).json({ error: 'Error adding doctor', message: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    // Saare Doctors ko fetch karein
    const doctors = await Doctor.find();

    // Send the list of doctors as the response
    res.status(200).json({ success: true, message: 'Doctors fetched successfully', data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching doctors', message: error.message });
  }
};
