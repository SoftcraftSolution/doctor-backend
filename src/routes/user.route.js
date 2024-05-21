const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const doctorController = require('../controller/doctor.controller');
const upload = require('../middleware/imageupload');


// Multer configuration for file upload

// Create a new user
router.post('/register', userController.createUser);
router.post('/login',userController.login);

// Get all users

router.get('/all-user',userController.getAllUsers)
// Get a specific user by ID
router.get('/:id', userController.getUserById);

// Update a user by ID
router.put('/:id', userController.updateUser);

// Delete a user by ID



/////////////////////////////////////////
//DOCTOR
router.post('/add-doctor', upload.single('imageUrl'), doctorController.addDoctor);
router.get('/',doctorController.getAllDoctors)
//////////////////////////////////////////////
//PATIENT


module.exports = router;
