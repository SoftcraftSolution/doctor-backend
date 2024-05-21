// controllers/appointmentController.js

const Appointment = require('../model/appointment.model');
const moment = require('moment');

exports.bookAppointment = async (req, res) => {
    try {
        // Extract data from the request body
        const { patientId, doctorId, clinicId, appointmentDate, appointmentTime } = req.body;

        // Create a new appointment instance
        const newAppointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            clinic: clinicId,
            appointmentDate,
            appointmentTime,
            status: 'scheduled' // Default status
            // You can add more fields here if needed
        });

        // Save the appointment to the database
        await newAppointment.save();

        res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: ' Internal Server Error' });
    }
};
exports.getAvailableTimeSlots = async (req, res) => {
    try {
        // Extract the date from the request body
        const { date } = req.body;

        // Check if the date is valid and convert it to a proper format
        const selectedDate = moment(date, 'YYYY-MM-DD', true);
        if (!selectedDate.isValid()) {
            return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD format.' });
        }

        // Find existing appointments for the selected date
        const existingAppointments = await Appointment.find({ appointmentDate: selectedDate.toDate() });

        // Define the time slots (assuming each appointment is 30 minutes)
        const availableTimeSlots = [];
        const startTime = moment('09:00', 'HH:mm');
        const endTime = moment('17:00', 'HH:mm');

        // Loop through the time slots for the selected date
        while (startTime.isBefore(endTime)) {
            // Check if the current time slot is available
            const isAvailable = existingAppointments.every(appointment => {
                const appointmentStart = moment(appointment.appointmentTime, 'HH:mm');
                const appointmentEnd = appointmentStart.clone().add(30, 'minutes');
                return startTime.isBefore(appointmentStart) || startTime.isSameOrAfter(appointmentEnd);
            });

            // If available, add the time slot to the list
            if (isAvailable) {
                availableTimeSlots.push(startTime.format('HH:mm'));
            }

            // Move to the next time slot (30 minutes ahead)
            startTime.add(30, 'minutes');
        }

        // Send the list of available time slots as the response
        res.status(200).json({ availableTimeSlots });
    } catch (err) {
        console.error('Error fetching available time slots:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.cancelAppointment = async (req, res) => {
    try {
        // Extract appointmentId from request body
        const { appointmentId } = req.body;

        // Check if appointmentId is provided
        if (!appointmentId) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        // Find the appointment in the database
        const appointment = await Appointment.findById(appointmentId);

        // Check if the appointment exists
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if the appointment status is already cancelled
        if (appointment.status === 'cancelled') {
            return res.status(400).json({ message: 'Appointment is already cancelled' });
        }

        // Update the appointment status to cancelled
        appointment.status = 'cancelled';
        await appointment.save();

        // Send response
        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling appointment:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.rescheduleAppointment = async (req, res) => {
    try {
        // Extract appointmentId and newAppointmentDate from request body
        const { appointmentId, newAppointmentDate } = req.body;

        // Check if appointmentId and newAppointmentDate are provided
        if (!appointmentId || !newAppointmentDate) {
            return res.status(400).json({ message: 'Appointment ID and new appointment date are required' });
        }

        // Find the appointment in the database
        const appointment = await Appointment.findById(appointmentId);

        // Check if the appointment exists
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Update the appointment date and status
        appointment.appointmentDate = newAppointmentDate;
        appointment.status = 'rescheduled'; // Update status to indicate rescheduling
        await appointment.save();

        // Send response
        res.status(200).json({ message: 'Appointment rescheduled successfully', appointment });
    } catch (err) {
        console.error('Error rescheduling appointment:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
// Controller method to get appointments daywise
exports.getAppointmentsDaywise = async (req, res) => {
    try {
        // Extract the date from the request query parameters
        const { date } = req.query;

        // Check if the date parameter is provided
        if (!date) {
            return res.status(400).json({ message: 'Date parameter is required' });
        }

        // Parse the date string into a Date object
        const appointmentDate = new Date(date);

        // Check if the date is valid
        if (isNaN(appointmentDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Find appointments for the specified date
        const appointments = await Appointment.find({ appointmentDate: { $eq: appointmentDate } });

        // Send response with the appointments
        res.status(200).json({ appointments });
    } catch (err) {
        console.error('Error fetching daywise appointments:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
