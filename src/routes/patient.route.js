const express = require('express');
const router = express.Router();

const patientController=require('../controller/patient.controller');
const appointmentController=require('../controller/appoinment.controller')
const clinicController=require('../controller/clinic.controller')

// Multer configuration for file upload

// Create a new user

// Get all users



router.post('/add-patient',patientController.addPatient);
router.get('/waiting-list',patientController.getWaitingList)
router.post('/delay-notification',patientController.trackDoctorActivity)
router.post('/book', appointmentController.bookAppointment);
router.post('/add-clinic',clinicController.addClinic)
router.post('/availableTimeSlots', appointmentController.getAvailableTimeSlots);
router.post('/cancel-appointment',appointmentController.cancelAppointment)
router.post('/reschedule-appoinment',appointmentController.rescheduleAppointment)
router.get('/daywise',appointmentController.getAppointmentsDaywise)
module.exports = router;
