# Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Patient Endpoints

### 1. Get All Patients
**GET** `/patients`

**Query Parameters:**
- `AN` (string, optional) - Filter by Admission Number
- `name` (string, optional) - Search by patient name (case-insensitive)
- `pdx` (string, optional) - Filter by principal diagnosis code
- `drg` (string, optional) - Filter by DRG code
- `dateadm` (date, optional) - Filter by admission date (>=)

**Response:**
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "AN": "A2024001",
      "dob": "1980-05-15T00:00:00.000Z",
      "sex": "M",
      "dateadm": "2024-02-01T00:00:00.000Z",
      "datedsc": "2024-02-05T00:00:00.000Z",
      "age": 44,
      "cc": "Chest pain",
      "pi": "Patient presented with...",
      "ph": "Hypertension, Diabetes",
      "patient_examine": "BP: 140/90...",
      "pre_diagnosis": "Acute coronary syndrome",
      "pdx": "I21.0",
      "sdx1": "I10",
      "sdx2": "E11.9",
      "proc1": "00.66",
      "drg": "280",
      "rw": 1.5432,
      "lengthofstay": 4,
      "createdAt": "2024-02-01T10:00:00.000Z",
      "updatedAt": "2024-02-05T15:30:00.000Z"
    }
  ]
}
```

### 2. Get Patient by ID
**GET** `/patients/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    ...
  }
}
```

### 3. Get Patient by AN (Admission Number)
**GET** `/patients/an/:an`

**Example:** `/patients/an/A2024001`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "AN": "A2024001",
    ...
  }
}
```

### 4. Create New Patient
**POST** `/patients`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "AN": "A2024002",
  "dob": "1990-03-20",
  "sex": "F",
  "dateadm": "2024-02-10",
  "timeadm": "14:30",
  "age": 34,
  "cc": "Abdominal pain",
  "pi": "Patient reports...",
  "ph": "None",
  "patient_examine": "Abdomen: tender...",
  "pre_diagnosis": "Acute appendicitis",
  "reason_for_admit": "Emergency admission",
  "treatment_plan": "Appendectomy planned"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "AN": "A2024002",
    ...
  }
}
```

### 5. Update Patient
**PUT** `/patients/:id`

**Request Body:** (same as create, all fields optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    ...
  }
}
```

### 6. Delete Patient
**DELETE** `/patients/:id`

**Response:**
```json
{
  "success": true,
  "message": "Patient deleted successfully",
  "data": {}
}
```

### 7. Get Patient Statistics (Dashboard Data)
**GET** `/patients/stats/summary`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalPatients": 150,
      "completedCount": 120,
      "pendingCount": 20,
      "inReviewCount": 10,
      "recentAdmissions": 15,
      "avgLengthOfStay": 4.5,
      "avgAge": 52.3,
      "avgRW": 1.2345
    },
    "codes": {
      "totalCodes": 450,
      "avgCodesPerPatient": 3.0
    },
    "topDRGs": [
      {
        "_id": "280",
        "count": 25,
        "avgRW": 1.5432,
        "avgLOS": 4.2
      },
      {
        "_id": "470",
        "count": 18,
        "avgRW": 0.8765,
        "avgLOS": 3.5
      }
    ],
    "departments": [
      {
        "_id": "Cardiology",
        "department": "Cardiology",
        "count": 45,
        "withCodes": 42,
        "accuracy": 93.33
      },
      {
        "_id": "Respiratory",
        "department": "Respiratory",
        "count": 38,
        "withCodes": 36,
        "accuracy": 94.74
      },
      {
        "_id": "General",
        "department": "General",
        "count": 30,
        "withCodes": 25,
        "accuracy": 83.33
      }
    ]
  }
}
```

## Patient Data Model

### Required Fields
- `name` (String) - Patient full name
- `AN` (String) - Admission Number (unique)
- `dob` (Date) - Date of birth
- `sex` (String) - Gender: 'M', 'F', 'male', 'female', or 'other'
- `dateadm` (Date) - Admission date

### Optional Fields

#### Demographics
- `age` (Number) - Patient age
- `ageday` (Number) - Age in days (for infants)

#### Admission Info
- `timeadm` (String) - Admission time
- `datedsc` (Date) - Discharge date
- `timedsc` (String) - Discharge time

#### Medical History
- `cc` (String) - Chief complaint
- `pi` (String) - Present illness
- `ph` (String) - Past history
- `fh` (String) - Family history

#### Physical Examination
- `patient_examine` (String) - Physical examination findings

#### Vital Signs
- `bt` (String) - Body temperature
- `pr` (String) - Pulse rate
- `rr` (String) - Respiratory rate
- `bp` (String) - Blood pressure
- `o2` (String) - Oxygen saturation

#### Diagnosis & Treatment
- `pre_diagnosis` (String) - Preliminary diagnosis
- `reason_for_admit` (String) - Reason for admission
- `treatment_plan` (String) - Treatment plan

#### Coding
- `pdx` (String) - Principal diagnosis (ICD-10)
- `sdx1` to `sdx12` (String) - Secondary diagnoses
- `proc1` to `proc20` (String) - Procedures (ICD-9-CM)

#### DRG Information
- `drg` (String) - DRG code
- `rw` (Number) - Relative weight
- `wtlos` (Number) - Weighted length of stay
- `adjrw` (Number) - Adjusted relative weight
- `lengthofstay` (Number) - Length of stay in days

## Status Determination

The patient status is determined by the backend based on the following logic:

- **COMPLETED**: Patient has `datedsc` (discharge date)
- **PENDING**: Patient has no `datedsc` and no `pdx` (no codes assigned)
- **IN_REVIEW**: Patient has no `datedsc` but has `pdx` (codes assigned but not discharged)
- **FLAGGED**: Determined by frontend based on business rules

## Department Classification

Departments are automatically classified based on the principal diagnosis code (pdx):

- **Respiratory**: Codes starting with J or R
- **Cardiology**: Codes starting with I
- **Neurology**: Codes starting with G
- **Orthopedics**: Codes starting with M or S
- **General**: All other codes

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Please provide patient name",
    "Please provide AN (Admission Number)"
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Patient not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Error message details"
}
```

## Usage Examples

### Fetch All Patients
```javascript
const response = await fetch('http://localhost:5000/api/patients');
const data = await response.json();
console.log(data.data); // Array of patients
```

### Search Patients by Name
```javascript
const response = await fetch('http://localhost:5000/api/patients?name=John');
const data = await response.json();
```

### Get Dashboard Statistics
```javascript
const response = await fetch('http://localhost:5000/api/patients/stats/summary');
const { summary, codes, topDRGs, departments } = await response.json().data;
```

### Create New Patient
```javascript
const response = await fetch('http://localhost:5000/api/patients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    AN: 'A2024001',
    dob: '1980-05-15',
    sex: 'M',
    dateadm: '2024-02-10',
  }),
});
const data = await response.json();
```

### Update Patient
```javascript
const response = await fetch('http://localhost:5000/api/patients/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    pdx: 'I21.0',
    sdx1: 'I10',
    drg: '280',
  }),
});
const data = await response.json();
```

## Notes

1. All dates should be in ISO 8601 format
2. The `lengthofstay` is automatically calculated if `dateadm` and `datedsc` are provided
3. Virtual fields `calculatedAge` and `admissionDuration` are available in responses
4. Indexes are created on: AN, name, dateadm, datedsc, pdx, drg for optimal query performance
5. The statistics endpoint uses MongoDB aggregation for efficient data processing

## CORS Configuration

The backend allows cross-origin requests from the frontend running on `http://localhost:5173` (Vite default port).
