require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const userRoutes = require('./src/routes/user.route');
const patientRoutes = require('./src/routes/patient.route');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Use port from environment variable or default to 3000

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cloudinary = require('cloudinary').v2;

// Load environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Enforce HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    // Redirect HTTP to HTTPS
    return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
  }
  next();
});

// Default API route
app.get('/', (_, res) => {
  res.send('API Running');
});

// Handle requests to the '/favicon.ico' endpoint
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Serve Uploaded Images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// User Routes
app.use('/user', userRoutes);
app.use('/patient', patientRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

// WebSocket server code


  // WebSocket close event handler





