const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Get all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one patient by custom ID
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findOne({ _id: req.params.id });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create patient
router.post('/', async (req, res) => {
    const patient = new Patient(req.body);
    try {
        const newPatient = await patient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update patient
router.patch('/:id', async (req, res) => {
    try {
        const patient = await Patient.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete patient
router.delete('/:id', async (req, res) => {
    try {
        const result = await Patient.findOneAndDelete({ id: req.params.id });
        if (!result) return res.status(404).json({ message: 'Patient not found' });
        res.json({ message: 'Patient deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
