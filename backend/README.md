# Hackathon Backend API

Backend API built with **Express.js** and **MongoDB** for the Hackathon project.

## 🚀 Features

- RESTful API architecture
- MongoDB database with Mongoose ODM
- Patient management with comprehensive medical records
- DRG coding and statistics
- Error handling and validation
- Request logging
- CORS enabled

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hackathon
   CORS_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```

## 🏃 Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Health Check
- `GET /` - Server health check

### Patients
- `GET /api/patients` - Get all patients (supports query params: `AN`, `name`, `pdx`, `drg`, `dateadm`)
- `GET /api/patients/:id` - Get patient by ID
- `GET /api/patients/an/:an` - Get patient by AN (Admission Number)
- `GET /api/patients/stats/summary` - Get patient statistics
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient


## 📝 Example Requests

### Create Patient
```bash
POST /api/patients
Content-Type: application/json

{
  "name": "นายสมชาย ใจดี",
  "AN": "AN2024001234",
  "dob": "1985-03-15",
  "sex": "M",
  "dateadm": "2024-02-14",
  "timeadm": "14:30",
  "age": 39,
  "cc": "Chest pain",
  "pi": "Patient presented with acute chest pain for 2 hours",
  "bt": "37.2",
  "pr": "85",
  "rr": "18",
  "bp": "130/85",
  "o2": "98",
  "pre_diagnosis": "Acute coronary syndrome",
  "reason_for_admit": "Chest pain evaluation",
  "pdx": "I21.9",
  "sdx1": "E11.9",
  "proc1": "0BH17EZ",
  "drg": "280",
  "rw": 1.5432
}
```


## 🗂️ Project Structure

```
backend/
├── config/
│   └── database.js       # MongoDB connection
├── controllers/
│   ├── userController.js
│   └── patientController.js
├── middleware/
│   ├── errorHandler.js
│   └── logger.js
├── models/
│   ├── User.js
│   └── Patient.js
├── routes/
│   ├── userRoutes.js
│   └── patientRoutes.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js             # Entry point
```

## 🔧 Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger
- **nodemon** - Development auto-reload

## 📄 License

ISC
