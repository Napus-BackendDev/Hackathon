const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hackathon Backend API',
            version: '1.0.0',
            description: 'Backend API สำหรับระบบบันทึกข้อมูลผู้ป่วยในโรงพยาบาล พร้อม MongoDB + Express',
            contact: {
                name: 'API Support',
                email: 'support@hackathon.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
            {
                url: 'https://api.hackathon.com',
                description: 'Production server',
            },
        ],
        tags: [
            {
                name: 'Health',
                description: 'Health check endpoints',
            },
            {
                name: 'Users',
                description: 'User management endpoints',
            },
            {
                name: 'Patients',
                description: 'Patient management endpoints',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'User ID',
                            example: '507f1f77bcf86cd799439011',
                        },
                        name: {
                            type: 'string',
                            description: 'User name',
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email',
                            example: 'john@example.com',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'User role',
                            example: 'user',
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'User active status',
                            example: true,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                        },
                    },
                },
                Patient: {
                    type: 'object',
                    required: ['name', 'AN', 'dob', 'sex', 'dateadm'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Patient ID',
                            example: '507f1f77bcf86cd799439011',
                        },
                        name: {
                            type: 'string',
                            description: 'ชื่อ-นามสกุลผู้ป่วย',
                            example: 'นายสมชาย ใจดี',
                        },
                        AN: {
                            type: 'string',
                            description: 'Admission Number (เลขที่ Admit)',
                            example: 'AN2024001234',
                        },
                        dob: {
                            type: 'string',
                            format: 'date',
                            description: 'วันเกิด (Date of Birth)',
                            example: '1985-03-15',
                        },
                        sex: {
                            type: 'string',
                            enum: ['M', 'F', 'male', 'female', 'other'],
                            description: 'เพศ',
                            example: 'M',
                        },
                        dateadm: {
                            type: 'string',
                            format: 'date',
                            description: 'วันที่รับเข้า (Admission Date)',
                            example: '2024-02-14',
                        },
                        timeadm: {
                            type: 'string',
                            description: 'เวลารับเข้า',
                            example: '14:30',
                        },
                        datedsc: {
                            type: 'string',
                            format: 'date',
                            description: 'วันที่จำหน่าย (Discharge Date)',
                            example: '2024-02-20',
                        },
                        timedsc: {
                            type: 'string',
                            description: 'เวลาจำหน่าย',
                            example: '10:00',
                        },
                        age: {
                            type: 'number',
                            description: 'อายุ (ปี)',
                            example: 39,
                        },
                        ageday: {
                            type: 'number',
                            description: 'อายุ (วัน) - สำหรับทารก',
                            example: 14235,
                        },
                        cc: {
                            type: 'string',
                            description: 'Chief Complaint - อาการสำคัญ',
                            example: 'Chest pain',
                        },
                        pi: {
                            type: 'string',
                            description: 'Present Illness - ประวัติการเจ็บป่วยปัจจุบัน',
                            example: 'Patient presented with acute chest pain for 2 hours',
                        },
                        ph: {
                            type: 'string',
                            description: 'Past History - ประวัติการเจ็บป่วยในอดีต',
                            example: 'Hypertension for 5 years',
                        },
                        fh: {
                            type: 'string',
                            description: 'Family History - ประวัติครอบครัว',
                            example: 'Father had MI at age 60',
                        },
                        patient_examine: {
                            type: 'string',
                            description: 'ผลการตรวจร่างกาย',
                            example: 'Alert, conscious, no acute distress',
                        },
                        bt: {
                            type: 'string',
                            description: 'Body Temperature - อุณหภูมิร่างกาย',
                            example: '37.2',
                        },
                        pr: {
                            type: 'string',
                            description: 'Pulse Rate - อัตราการเต้นของหัวใจ',
                            example: '85',
                        },
                        rr: {
                            type: 'string',
                            description: 'Respiratory Rate - อัตราการหายใจ',
                            example: '18',
                        },
                        bp: {
                            type: 'string',
                            description: 'Blood Pressure - ความดันโลหิต',
                            example: '130/85',
                        },
                        o2: {
                            type: 'string',
                            description: 'Oxygen Saturation - ออกซิเจนในเลือด',
                            example: '98',
                        },
                        pre_diagnosis: {
                            type: 'string',
                            description: 'การวินิจฉัยเบื้องต้น',
                            example: 'Acute coronary syndrome',
                        },
                        reason_for_admit: {
                            type: 'string',
                            description: 'เหตุผลในการรับเข้า',
                            example: 'Chest pain evaluation',
                        },
                        treatment_plan: {
                            type: 'string',
                            description: 'แผนการรักษา',
                            example: 'Cardiac monitoring, antiplatelet therapy',
                        },
                        pdx: {
                            type: 'string',
                            description: 'Principal Diagnosis - การวินิจฉัยหลัก (ICD-10)',
                            example: 'I21.9',
                        },
                        sdx1: { type: 'string', description: 'Secondary Diagnosis 1', example: 'E11.9' },
                        sdx2: { type: 'string', description: 'Secondary Diagnosis 2' },
                        sdx3: { type: 'string', description: 'Secondary Diagnosis 3' },
                        sdx4: { type: 'string', description: 'Secondary Diagnosis 4' },
                        sdx5: { type: 'string', description: 'Secondary Diagnosis 5' },
                        sdx6: { type: 'string', description: 'Secondary Diagnosis 6' },
                        sdx7: { type: 'string', description: 'Secondary Diagnosis 7' },
                        sdx8: { type: 'string', description: 'Secondary Diagnosis 8' },
                        sdx9: { type: 'string', description: 'Secondary Diagnosis 9' },
                        sdx10: { type: 'string', description: 'Secondary Diagnosis 10' },
                        sdx11: { type: 'string', description: 'Secondary Diagnosis 11' },
                        sdx12: { type: 'string', description: 'Secondary Diagnosis 12' },
                        proc1: { type: 'string', description: 'Procedure Code 1 (ICD-10-PCS)', example: '0BH17EZ' },
                        proc2: { type: 'string', description: 'Procedure Code 2' },
                        proc3: { type: 'string', description: 'Procedure Code 3' },
                        proc4: { type: 'string', description: 'Procedure Code 4' },
                        proc5: { type: 'string', description: 'Procedure Code 5' },
                        proc6: { type: 'string', description: 'Procedure Code 6' },
                        proc7: { type: 'string', description: 'Procedure Code 7' },
                        proc8: { type: 'string', description: 'Procedure Code 8' },
                        proc9: { type: 'string', description: 'Procedure Code 9' },
                        proc10: { type: 'string', description: 'Procedure Code 10' },
                        proc11: { type: 'string', description: 'Procedure Code 11' },
                        proc12: { type: 'string', description: 'Procedure Code 12' },
                        proc13: { type: 'string', description: 'Procedure Code 13' },
                        proc14: { type: 'string', description: 'Procedure Code 14' },
                        proc15: { type: 'string', description: 'Procedure Code 15' },
                        proc16: { type: 'string', description: 'Procedure Code 16' },
                        proc17: { type: 'string', description: 'Procedure Code 17' },
                        proc18: { type: 'string', description: 'Procedure Code 18' },
                        proc19: { type: 'string', description: 'Procedure Code 19' },
                        proc20: { type: 'string', description: 'Procedure Code 20' },
                        drg: {
                            type: 'string',
                            description: 'DRG Code - รหัส DRG',
                            example: '280',
                        },
                        rw: {
                            type: 'number',
                            description: 'Relative Weight - น้ำหนักสัมพัทธ์',
                            example: 1.5432,
                        },
                        wtlos: {
                            type: 'number',
                            description: 'Weight Length of Stay',
                            example: 5.5,
                        },
                        adjrw: {
                            type: 'number',
                            description: 'Adjusted Relative Weight',
                            example: 1.6234,
                        },
                        lengthofstay: {
                            type: 'number',
                            description: 'Length of Stay - จำนวนวันนอน (คำนวณอัตโนมัติ)',
                            example: 5,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Error message',
                        },
                        error: {
                            type: 'string',
                            example: 'Detailed error description',
                        },
                    },
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        data: {
                            type: 'object',
                        },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js', './server.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
