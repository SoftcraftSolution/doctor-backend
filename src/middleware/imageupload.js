const multer = require('multer');

// Define multer storage configuration
const storage = multer.diskStorage({
  // Remove the destination property since you're uploading directly to Cloudinary
  filename: function (req, file, cb) {
    const uniqueIdentifier = Date.now(); // Generate a unique identifier (timestamp)
    const originalFilename = file.originalname; // Get the original filename
    const filename = `${uniqueIdentifier}-${originalFilename}`; // Combine the unique identifier and original filename
    cb(null, filename); // Call the callback function with the generated filename
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });

module.exports = upload;
