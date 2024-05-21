// Required modules
const Patient = require('../model/patient.model');
const WebSocket = require('ws');
const { sendDelayNotificationEmail } = require('../middleware/email');

// Create WebSocket server instance
const wss = new WebSocket.Server({ port: 4000 });

// Function to send waiting list updates to WebSocket clients
const broadcastWaitingListUpdates = async () => {
    try {
        // Retrieve updated waiting list from the database
        const waitingList = await Patient.find({}).sort({ waitTime: 1 });
        const waitingListJSON = JSON.stringify(waitingList);

        // Broadcast waiting list updates to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(waitingListJSON);
            }
        });
    } catch (err) {
        console.error('Error broadcasting waiting list updates:', err);
    }
};

// Function to send delay notification to WebSocket clients
const sendDelayNotification = async (patient) => {
    try {
        // Check if patient is found and has patientNumber
        if (patient && patient.patientNumber) {
            // Code to send delay notification to the patient
            console.log('Delay notification sent to patient:', patient.patientNumber);
        } else {
            console.error('Patient or patientNumber is null or undefined');
        }
        await sendDelayNotificationEmail(patient);
    } catch (err) {
        console.error('Error sending delay notification:', err);
    }
};

// Controller method to add a new patient
exports.addPatient = async (req, res) => {
    try {
        // Calculate wait time for the new patient
        const totalPatients = await Patient.countDocuments({});
        const expectedTimePerPatient = 15; // Example: 15 minutes per patient
        const waitTime = totalPatients * expectedTimePerPatient;

        // Create a new patient instance
        const newPatient = new Patient({
            name: req.body.name,
            contactNumber: req.body.contactNumber,
            patientNumber: req.body.patientNumber,
            status: req.body.status,
            waitTime: waitTime // Assign calculated wait time
        });

        // Save the patient to the database
        await newPatient.save();

        // Broadcast real-time update about waiting list
        await broadcastWaitingListUpdates();

        res.status(201).json({ message: 'Patient added successfully' });
    } catch (err) {
        console.error('Error adding patient:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Controller method to get waiting list of patients
exports.getWaitingList = async (req, res) => {
    try {
        // Retrieve patients from the database sorted by their wait time
        const waitingList = await Patient.find({}).sort({ waitTime: 1 });

        // Check if waiting list is empty
        if (!waitingList || waitingList.length === 0) {
            return res.status(404).json({ message: 'Waiting list is empty' });
        }

        // Send waiting list as response
        res.status(200).json(waitingList);
    } catch (err) {
        console.error('Error retrieving waiting list:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// WebSocket connection event handler
wss.on('connection', async (ws) => {
    try {
        // Retrieve initial waiting list and send it to the connected client
        const waitingList = await Patient.find({}).sort({ waitTime: 1 });
        const waitingListJSON = JSON.stringify(waitingList);
        ws.send(waitingListJSON);
    } catch (err) {
        console.error('Error sending initial waiting list to client:', err);
    }
});

// Endpoint to track doctor's activity and send delay notifications
// Endpoint to track doctor's activity and send delay notifications
// Endpoint to track doctor's activity and send delay notifications
exports.trackDoctorActivity = async (req, res) => {
    try {
        // Implement logic to track doctor's activity and determine if there's a delay
        const delayedAppointments = await Patient.find({ status: 'scheduled' }).where('createdAt').lte(Date.now() - 15 * 60 * 1000);

        if (delayedAppointments && delayedAppointments.length > 0) {
            // Update status of delayed appointments
            await Patient.updateMany(
                { _id: { $in: delayedAppointments.map(appointment => appointment._id) } },
                { $set: { status: 'delayed' } }
            );

            // Send delay notification to WebSocket clients
            await broadcastWaitingListUpdates();

            // Send delay notification to patients
            for (const appointment of delayedAppointments) {
                await sendDelayNotification(appointment);
            }
        }

        res.status(200).json({ message: 'Doctor activity tracked successfully' });
    } catch (err) {
        console.error('Error tracking doctor activity:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};



