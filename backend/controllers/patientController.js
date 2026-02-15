const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Public
exports.getAllPatients = async (req, res) => {
    try {
        const { AN, name, pdx, drg, dateadm } = req.query;
        const filter = {};

        if (AN) filter.AN = AN;
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (pdx) filter.pdx = pdx;
        if (drg) filter.drg = drg;
        if (dateadm) filter.dateadm = { $gte: new Date(dateadm) };

        const patients = await Patient.find(filter);

        // Set headers to prevent caching and HTTP 304 responses
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Public
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        res.status(200).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Get patient by AN (Admission Number)
// @route   GET /api/patients/an/:an
// @access  Public
exports.getPatientByAN = async (req, res) => {
    try {
        const patient = await Patient.findOne({ AN: req.params.an });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        res.status(200).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Public
exports.createPatient = async (req, res) => {
    try {
        const patient = await Patient.create(req.body);

        res.status(201).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        // Handle duplicate AN error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'AN (Admission Number) already exists',
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Public
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        res.status(200).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Public
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Patient deleted successfully',
            data: {},
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Get patient statistics
// @route   GET /api/patients/stats/summary
// @access  Public
exports.getPatientStats = async (req, res) => {
    try {
        // Basic statistics
        const totalPatients = await Patient.countDocuments();

        // Status-based counts
        const completedCount = await Patient.countDocuments({ datedsc: { $exists: true, $ne: null } });
        const pendingCount = await Patient.countDocuments({
            datedsc: { $exists: false },
            pdx: { $exists: false }
        });
        const inReviewCount = await Patient.countDocuments({
            datedsc: { $exists: false },
            pdx: { $exists: true }
        });

        // Aggregate statistics
        const stats = await Patient.aggregate([
            {
                $group: {
                    _id: null,
                    totalPatients: { $sum: 1 },
                    avgLengthOfStay: { $avg: '$lengthofstay' },
                    avgAge: { $avg: '$age' },
                    avgRW: { $avg: '$rw' },
                },
            },
        ]);

        // DRG Statistics
        const drgStats = await Patient.aggregate([
            { $match: { drg: { $exists: true, $ne: null, $ne: '' } } },
            {
                $group: {
                    _id: '$drg',
                    count: { $sum: 1 },
                    avgRW: { $avg: '$rw' },
                    avgLOS: { $avg: '$lengthofstay' },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        // Department Statistics (based on diagnosis codes)
        const departmentStats = await Patient.aggregate([
            {
                $project: {
                    department: {
                        $cond: {
                            if: { $regexMatch: { input: { $ifNull: ['$pdx', ''] }, regex: /^(J|R)/ } },
                            then: 'Respiratory',
                            else: {
                                $cond: {
                                    if: { $regexMatch: { input: { $ifNull: ['$pdx', ''] }, regex: /^I/ } },
                                    then: 'Cardiology',
                                    else: {
                                        $cond: {
                                            if: { $regexMatch: { input: { $ifNull: ['$pdx', ''] }, regex: /^G/ } },
                                            then: 'Neurology',
                                            else: {
                                                $cond: {
                                                    if: { $regexMatch: { input: { $ifNull: ['$pdx', ''] }, regex: /^M|^S/ } },
                                                    then: 'Orthopedics',
                                                    else: 'General'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    hasCodes: {
                        $cond: {
                            if: {
                                $or: [
                                    { $ne: ['$pdx', null] },
                                    { $ne: ['$sdx1', null] },
                                    { $ne: ['$proc1', null] }
                                ]
                            },
                            then: 1,
                            else: 0
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 },
                    withCodes: { $sum: '$hasCodes' },
                }
            },
            {
                $project: {
                    department: '$_id',
                    count: 1,
                    accuracy: {
                        $multiply: [
                            { $divide: ['$withCodes', '$count'] },
                            100
                        ]
                    }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Recent admissions (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentAdmissions = await Patient.countDocuments({
            dateadm: { $gte: sevenDaysAgo }
        });

        // Code statistics
        const codeStats = await Patient.aggregate([
            {
                $project: {
                    totalCodes: {
                        $size: {
                            $filter: {
                                input: [
                                    '$pdx', '$sdx1', '$sdx2', '$sdx3', '$sdx4', '$sdx5',
                                    '$sdx6', '$sdx7', '$sdx8', '$sdx9', '$sdx10', '$sdx11', '$sdx12',
                                    '$proc1', '$proc2', '$proc3', '$proc4', '$proc5',
                                    '$proc6', '$proc7', '$proc8', '$proc9', '$proc10',
                                    '$proc11', '$proc12', '$proc13', '$proc14', '$proc15',
                                    '$proc16', '$proc17', '$proc18', '$proc19', '$proc20'
                                ],
                                as: 'code',
                                cond: {
                                    $and: [
                                        { $ne: ['$$code', null] },
                                        { $ne: ['$$code', ''] }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCodes: { $sum: '$totalCodes' },
                    avgCodesPerPatient: { $avg: '$totalCodes' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalPatients,
                    completedCount,
                    pendingCount,
                    inReviewCount,
                    recentAdmissions,
                    avgLengthOfStay: stats[0]?.avgLengthOfStay || 0,
                    avgAge: stats[0]?.avgAge || 0,
                    avgRW: stats[0]?.avgRW || 0,
                },
                codes: {
                    totalCodes: codeStats[0]?.totalCodes || 0,
                    avgCodesPerPatient: codeStats[0]?.avgCodesPerPatient || 0,
                },
                topDRGs: drgStats,
                departments: departmentStats,
            },
        });
    } catch (error) {
        console.error('Error in getPatientStats:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

