const express = require('express');
const router = express.Router();
const {
    getAllPatients,
    getPatientById,
    getPatientByAN,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientStats,
} = require('../controllers/patientController');

// Statistics route (must be before /:id to avoid conflict)
router.route('/stats/summary').get(getPatientStats);

// Search by AN route
router.route('/an/:an').get(getPatientByAN);

// Main patient routes
router.route('/').get(getAllPatients).post(createPatient);

router.route('/:id').get(getPatientById).put(updatePatient).delete(deletePatient);

module.exports = router;
