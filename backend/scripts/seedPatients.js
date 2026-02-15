require('dotenv').config();
const mongoose = require('mongoose');
const Patient = require('../models/Patient');

// Helper function to generate random date
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random vital signs
const randomVitals = () => ({
    bt: (36.5 + Math.random() * 2).toFixed(1),
    pr: Math.floor(60 + Math.random() * 40).toString(),
    rr: Math.floor(14 + Math.random() * 10).toString(),
    bp: `${Math.floor(110 + Math.random() * 40)}/${Math.floor(70 + Math.random() * 20)}`,
    o2: Math.floor(94 + Math.random() * 6).toString(),
});

// Comprehensive sample patient data with various conditions
const generatePatients = () => {
    const patients = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-02-15');

    // Thai names
    const firstNames = [
        'สมชาย', 'สมหญิง', 'วิชัย', 'วิภา', 'สมศักดิ์', 'สมใจ', 'ประเสริฐ', 'สุดา',
        'นิรันดร์', 'รัตนา', 'สุรชัย', 'มาลี', 'ธนา', 'วรรณา', 'อนุชา', 'พิมพ์',
        'ชัยวัฒน์', 'สุภา', 'เกรียงไกร', 'นภา', 'บุญมี', 'จันทร์', 'สมบัติ', 'ศรี',
        'ประยุทธ์', 'ลักษณ์', 'วีระ', 'นวล', 'สุรินทร์', 'แสง'
    ];

    const lastNames = [
        'ใจดี', 'สุขใจ', 'รักสุขภาพ', 'แข็งแรง', 'สวยงาม', 'มั่นคง', 'เจริญ', 'รุ่งเรือง',
        'สว่าง', 'ดี', 'งาม', 'สุข', 'ทอง', 'เพชร', 'แก้ว', 'จันทร์',
        'ศรี', 'บุญ', 'ชัย', 'วิชัย', 'สมบูรณ์', 'เจริญสุข', 'มีสุข', 'รักษา',
        'พัฒนา', 'สร้าง', 'ก่อ', 'ปลูก', 'เลี้ยง', 'ดู'
    ];

    // Disease data with ICD-10 codes
    const diseases = [
        // Cardiology (I codes)
        {
            pdx: 'I21.9', name: 'Acute myocardial infarction', cc: 'Chest pain',
            pi: 'Acute chest pain radiating to left arm for 2 hours',
            ph: 'Hypertension, Diabetes', drg: '280', rw: 1.5432, los: [3, 7],
            procs: ['0BH17EZ', '02703DZ'], sdx: ['E11.9', 'I10']
        },
        {
            pdx: 'I50.9', name: 'Heart failure', cc: 'Shortness of breath',
            pi: 'Progressive dyspnea on exertion for 1 week',
            ph: 'Coronary artery disease', drg: '291', rw: 1.2345, los: [4, 8],
            procs: ['0BH13EZ'], sdx: ['I25.10', 'I10']
        },
        {
            pdx: 'I63.9', name: 'Cerebral infarction', cc: 'Weakness and confusion',
            pi: 'Sudden onset right sided weakness',
            ph: 'Hypertension, Atrial fibrillation', drg: '064', rw: 2.1567, los: [5, 10],
            procs: ['3E03317'], sdx: ['I48.91', 'I10', 'E11.9']
        },

        // Respiratory (J codes)
        {
            pdx: 'J18.9', name: 'Pneumonia', cc: 'Fever and cough',
            pi: 'High fever with productive cough for 3 days',
            ph: 'No significant history', drg: '195', rw: 0.8234, los: [3, 7],
            procs: [], sdx: []
        },
        {
            pdx: 'J44.1', name: 'COPD with exacerbation', cc: 'Dyspnea',
            pi: 'Worsening shortness of breath',
            ph: 'COPD, Smoking history', drg: '190', rw: 0.9876, los: [4, 8],
            procs: ['0BH13EZ'], sdx: ['F17.210']
        },
        {
            pdx: 'J45.901', name: 'Asthma exacerbation', cc: 'Wheezing',
            pi: 'Acute asthma attack unresponsive to home medication',
            ph: 'Asthma since childhood', drg: '202', rw: 0.7123, los: [2, 5],
            procs: [], sdx: []
        },

        // Neurology (G codes)
        {
            pdx: 'G40.909', name: 'Epilepsy', cc: 'Seizure',
            pi: 'Generalized tonic-clonic seizure',
            ph: 'Epilepsy on medication', drg: '100', rw: 1.1234, los: [2, 5],
            procs: [], sdx: []
        },
        {
            pdx: 'G43.909', name: 'Migraine', cc: 'Severe headache',
            pi: 'Severe unilateral headache with nausea',
            ph: 'Recurrent migraines', drg: '102', rw: 0.6543, los: [1, 3],
            procs: [], sdx: []
        },

        // Orthopedics (M, S codes)
        {
            pdx: 'M17.11', name: 'Knee osteoarthritis', cc: 'Knee pain',
            pi: 'Progressive knee pain limiting mobility',
            ph: 'Obesity, Previous knee injury', drg: '469', rw: 1.8765, los: [3, 7],
            procs: ['0SRC0JZ'], sdx: ['E66.9']
        },
        {
            pdx: 'S72.001A', name: 'Femur fracture', cc: 'Hip pain after fall',
            pi: 'Fall from standing height',
            ph: 'Osteoporosis', drg: '480', rw: 2.3456, los: [5, 10],
            procs: ['0QS604Z'], sdx: ['M81.0']
        },
        {
            pdx: 'M79.3', name: 'Myalgia', cc: 'Muscle pain',
            pi: 'Generalized muscle pain and weakness',
            ph: 'No significant history', drg: '557', rw: 0.7890, los: [2, 4],
            procs: [], sdx: []
        },

        // General/Other
        {
            pdx: 'K35.80', name: 'Acute appendicitis', cc: 'Abdominal pain',
            pi: 'Right lower quadrant pain for 6 hours',
            ph: 'No significant history', drg: '338', rw: 1.2145, los: [2, 4],
            procs: ['0DTJ4ZZ'], sdx: []
        },
        {
            pdx: 'K80.00', name: 'Cholelithiasis', cc: 'Right upper quadrant pain',
            pi: 'Colicky pain after fatty meal',
            ph: 'Obesity', drg: '417', rw: 1.4567, los: [2, 5],
            procs: ['0FT44ZZ'], sdx: ['E66.9']
        },
        {
            pdx: 'N39.0', name: 'Urinary tract infection', cc: 'Dysuria',
            pi: 'Burning sensation on urination',
            ph: 'Recurrent UTIs', drg: '690', rw: 0.6789, los: [2, 4],
            procs: [], sdx: []
        },
        {
            pdx: 'O80', name: 'Normal delivery', cc: 'Labor pain',
            pi: 'Term pregnancy in active labor',
            ph: 'Uncomplicated pregnancy', drg: '775', rw: 0.6789, los: [2, 3],
            procs: ['10E0XZZ'], sdx: []
        },
    ];

    // Generate 50 patients
    for (let i = 1; i <= 50; i++) {
        const disease = diseases[Math.floor(Math.random() * diseases.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const prefix = Math.random() > 0.5 ? 'นาย' : 'นาง';
        const sex = prefix === 'นาย' ? 'M' : 'F';

        const dob = randomDate(new Date('1950-01-01'), new Date('2010-01-01'));
        const age = Math.floor((new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000));

        const dateadm = randomDate(startDate, endDate);
        const vitals = randomVitals();

        // Determine if patient is discharged (70% chance)
        const isDischarged = Math.random() > 0.3;
        const hasCodes = Math.random() > 0.2; // 80% have codes

        let datedsc = null;
        let lengthofstay = null;

        if (isDischarged) {
            const losRange = disease.los;
            lengthofstay = Math.floor(losRange[0] + Math.random() * (losRange[1] - losRange[0]));
            datedsc = new Date(dateadm);
            datedsc.setDate(datedsc.getDate() + lengthofstay);
        }

        const patient = {
            name: `${prefix}${firstName} ${lastName}`,
            AN: `AN2024${String(i).padStart(6, '0')}`,
            dob,
            sex,
            dateadm,
            timeadm: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            ...(datedsc && {
                datedsc,
                timedsc: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            }),
            age,
            ageday: Math.floor(age * 365.25),
            cc: disease.cc,
            pi: disease.pi,
            ph: disease.ph,
            fh: Math.random() > 0.7 ? 'Family history of similar condition' : 'No significant family history',
            patient_examine: 'Physical examination findings documented',
            ...vitals,
            pre_diagnosis: disease.name,
            reason_for_admit: `Admission for ${disease.name.toLowerCase()} management`,
            treatment_plan: 'Comprehensive treatment plan initiated',
            ...(hasCodes && {
                pdx: disease.pdx,
                ...(disease.sdx.length > 0 && {
                    sdx1: disease.sdx[0],
                    ...(disease.sdx[1] && { sdx2: disease.sdx[1] }),
                    ...(disease.sdx[2] && { sdx3: disease.sdx[2] }),
                }),
                ...(disease.procs.length > 0 && {
                    proc1: disease.procs[0],
                    ...(disease.procs[1] && { proc2: disease.procs[1] }),
                }),
                drg: disease.drg,
                rw: disease.rw,
            }),
            ...(lengthofstay && { lengthofstay }),
        };

        patients.push(patient);
    }

    return patients;
};

// Connect to MongoDB and seed data
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing patients
        await Patient.deleteMany({});
        console.log('🗑️  Cleared existing patients');

        // Generate and insert patients
        const samplePatients = generatePatients();
        const patients = await Patient.insertMany(samplePatients);
        console.log(`✅ Inserted ${patients.length} sample patients`);

        // Calculate statistics
        const completed = patients.filter(p => p.datedsc).length;
        const pending = patients.filter(p => !p.datedsc && !p.pdx).length;
        const inReview = patients.filter(p => !p.datedsc && p.pdx).length;
        const totalCodes = patients.reduce((sum, p) => {
            let count = 0;
            if (p.pdx) count++;
            for (let i = 1; i <= 12; i++) {
                if (p[`sdx${i}`]) count++;
            }
            for (let i = 1; i <= 20; i++) {
                if (p[`proc${i}`]) count++;
            }
            return sum + count;
        }, 0);

        // Display summary
        console.log('\n📊 Database Summary:');
        console.log(`   Total Patients: ${patients.length}`);
        console.log(`   ✅ Completed (Discharged): ${completed}`);
        console.log(`   ⏳ Pending (No codes): ${pending}`);
        console.log(`   📝 In Review (Has codes, not discharged): ${inReview}`);
        console.log(`   💊 Total Codes: ${totalCodes}`);
        console.log(`   📈 Avg Codes/Patient: ${(totalCodes / patients.length).toFixed(2)}`);

        // Display sample patients
        console.log('\n📋 Sample Patients:');
        patients.slice(0, 5).forEach((patient, index) => {
            console.log(`${index + 1}. ${patient.name} (AN: ${patient.AN})`);
            console.log(`   - Age: ${patient.age} years`);
            console.log(`   - Diagnosis: ${patient.pdx || 'Not coded yet'}`);
            console.log(`   - DRG: ${patient.drg || 'N/A'} (RW: ${patient.rw || 'N/A'})`);
            console.log(`   - Status: ${patient.datedsc ? 'Discharged' : patient.pdx ? 'In Review' : 'Pending'}`);
            console.log(`   - Length of Stay: ${patient.lengthofstay || 'Still admitted'} days\n`);
        });

        console.log('✅ Database seeding completed successfully!');
        console.log('\n🚀 You can now start the server with: npm run dev');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeder
seedDatabase();
