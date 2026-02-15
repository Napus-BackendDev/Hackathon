const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
    {
        // Patient Demographics
        name: {
            type: String,
            required: [true, 'Please provide patient name'],
            trim: true,
        },
        AN: {
            type: String,
            required: [true, 'Please provide AN (Admission Number)'],
            unique: true,
            trim: true,
        },
        dob: {
            type: Date,
            required: [true, 'Please provide date of birth'],
        },
        sex: {
            type: String,
            enum: ['M', 'F', 'male', 'female', 'other'],
            required: [true, 'Please provide sex'],
        },

        // Admission Information
        dateadm: {
            type: Date,
            required: [true, 'Please provide admission date'],
        },
        timeadm: {
            type: String,
            trim: true,
        },
        datedsc: {
            type: Date,
        },
        timedsc: {
            type: String,
            trim: true,
        },

        // Age Information
        age: {
            type: Number,
        },
        ageday: {
            type: Number,
        },

        // Medical History
        cc: {
            type: String,
            trim: true,
        },
        pi: {
            type: String,
            trim: true,
        },
        ph: {
            type: String,
            trim: true,
        },
        fh: {
            type: String,
            trim: true,
        },

        // Physical Examination
        patient_examine: {
            type: String,
            trim: true,
        },

        // Vital Signs
        bt: {
            type: String,
            trim: true,
        },
        pr: {
            type: String,
            trim: true,
        },
        rr: {
            type: String,
            trim: true,
        },
        bp: {
            type: String,
            trim: true,
        },
        o2: {
            type: String,
            trim: true,
        },

        // Diagnosis and Treatment
        pre_diagnosis: {
            type: String,
            trim: true,
        },
        reason_for_admit: {
            type: String,
            trim: true,
        },
        treatment_plan: {
            type: String,
            trim: true,
        },

        // Principal and Secondary Diagnoses
        pdx: {
            type: String,
            trim: true,
        },
        sdx1: { type: String, trim: true },
        sdx2: { type: String, trim: true },
        sdx3: { type: String, trim: true },
        sdx4: { type: String, trim: true },
        sdx5: { type: String, trim: true },
        sdx6: { type: String, trim: true },
        sdx7: { type: String, trim: true },
        sdx8: { type: String, trim: true },
        sdx9: { type: String, trim: true },
        sdx10: { type: String, trim: true },
        sdx11: { type: String, trim: true },
        sdx12: { type: String, trim: true },

        // Procedures
        proc1: { type: String, trim: true },
        proc2: { type: String, trim: true },
        proc3: { type: String, trim: true },
        proc4: { type: String, trim: true },
        proc5: { type: String, trim: true },
        proc6: { type: String, trim: true },
        proc7: { type: String, trim: true },
        proc8: { type: String, trim: true },
        proc9: { type: String, trim: true },
        proc10: { type: String, trim: true },
        proc11: { type: String, trim: true },
        proc12: { type: String, trim: true },
        proc13: { type: String, trim: true },
        proc14: { type: String, trim: true },
        proc15: { type: String, trim: true },
        proc16: { type: String, trim: true },
        proc17: { type: String, trim: true },
        proc18: { type: String, trim: true },
        proc19: { type: String, trim: true },
        proc20: { type: String, trim: true },

        // DRG Information
        drg: {
            type: String,
            trim: true,
        },
        rw: {
            type: Number,
        },
        wtlos: {
            type: Number,
        },
        adjrw: {
            type: Number,
        },
        lengthofstay: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
patientSchema.index({ AN: 1 });
patientSchema.index({ name: 1 });
patientSchema.index({ dateadm: 1 });
patientSchema.index({ datedsc: 1 });
patientSchema.index({ pdx: 1 });
patientSchema.index({ drg: 1 });

// Virtual for calculated age from DOB
patientSchema.virtual('calculatedAge').get(function () {
    if (!this.dob) return null;
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Virtual for admission duration
patientSchema.virtual('admissionDuration').get(function () {
    if (!this.dateadm) return null;
    const endDate = this.datedsc || new Date();
    const startDate = new Date(this.dateadm);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Pre-save hook to calculate length of stay if not provided
patientSchema.pre('save', function (next) {
    if (this.dateadm && this.datedsc && !this.lengthofstay) {
        const startDate = new Date(this.dateadm);
        const endDate = new Date(this.datedsc);
        const diffTime = Math.abs(endDate - startDate);
        this.lengthofstay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    next();
});

patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema);
