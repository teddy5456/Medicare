const { connectToDatabase } = require('../config/db');
const { ObjectId } = require('mongodb');

// Create a new appointment
async function createAppointment(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const { appointmentType, patientId, doctorId, date, timeSlot, reason } = JSON.parse(body);

            if (!appointmentType || !patientId || !doctorId || !date || !timeSlot || !reason) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'All fields are required' }));
            }

            const db = await connectToDatabase();

            // Check for existing appointment for same doctor, date, and timeSlot
            const sessionConflict = await db.collection('appointments').findOne({
                doctorId: new ObjectId(doctorId),
                date: new Date(date),
                timeSlot
            });

            if (sessionConflict) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'This time slot is already booked for the selected doctor' }));
            }

            const newAppointment = {
                appointmentType,
                patientId: new ObjectId(patientId),
                doctorId: new ObjectId(doctorId),
                date: new Date(date),
                timeSlot,
                reason,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await db.collection('appointments').insertOne(newAppointment);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Appointment created', appointmentId: result.insertedId }));
        } catch (error) {
            console.error('createAppointment error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });
}

// Get appointments with optional filtering (patientId, doctorId, status)
async function getAppointments(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const patientId = url.searchParams.get('patientId');
    const doctorId = url.searchParams.get('doctorId');
    const status = url.searchParams.get('status');

    const filter = {};
    if (patientId) filter.patientId = new ObjectId(patientId);
    if (doctorId) filter.doctorId = new ObjectId(doctorId);
    if (status) filter.status = status;

    try {
        const db = await connectToDatabase();

        const appointments = await db.collection('appointments')
            .find(filter)
            .sort({ date: -1 })
            .toArray();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(appointments));
    } catch (error) {
        console.error('getAppointments error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

// Update an appointment (time, date, doctor, reason)
async function updateAppointment(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const appointmentIdFromUrl = url.pathname.split('/').pop(); // Supports PUT /api/appointments/:id

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const { date, timeSlot, doctorId, reason, status } = JSON.parse(body);
            const appointmentId = appointmentIdFromUrl;

            if (!appointmentId || (!date && !timeSlot && !doctorId && !reason && !status)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Appointment ID and at least one field to update are required' }));
            }

            const db = await connectToDatabase();

            const updateFields = {
                ...(date && { date: new Date(date) }),
                ...(timeSlot && { timeSlot }),
                ...(doctorId && { doctorId: new ObjectId(doctorId) }),
                ...(reason && { reason }),
                ...(status && { status }),
                updatedAt: new Date()
            };

            const result = await db.collection('appointments').updateOne(
                { _id: new ObjectId(appointmentId) },
                { $set: updateFields }
            );

            if (result.matchedCount === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Appointment not found' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Appointment updated successfully' }));
        } catch (error) {
            console.error('updateAppointment error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });
}

// Cancel (delete) an appointment
async function cancelAppointment(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const appointmentId = url.searchParams.get('appointmentId');

    if (!appointmentId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'appointmentId is required' }));
    }

    try {
        const db = await connectToDatabase();

        const result = await db.collection('appointments').deleteOne({ _id: new ObjectId(appointmentId) });

        if (result.deletedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Appointment not found' }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Appointment canceled successfully' }));
    } catch (error) {
        console.error('cancelAppointment error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointment,
    cancelAppointment
};
