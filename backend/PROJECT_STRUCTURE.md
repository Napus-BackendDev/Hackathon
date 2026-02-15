# 📁 Backend Project Structure

```
backend/
├── 📁 config/
│   └── database.js              # MongoDB connection configuration
│
├── 📁 controllers/
│   ├── userController.js        # User CRUD operations
│   └── patientController.js     # Patient CRUD operations + statistics
│
├── 📁 docs/
│   └── PATIENT_SCHEMA.md        # Patient schema documentation (Thai/English)
│
├── 📁 middleware/
│   ├── errorHandler.js          # Global error handling middleware
│   └── logger.js                # HTTP request logger (Morgan)
│
├── 📁 models/
│   ├── User.js                  # User schema (name, email, password, role)
│   └── Patient.js               # Patient schema (medical records, DRG, etc.)
│
├── 📁 routes/
│   ├── userRoutes.js            # User API routes
│   └── patientRoutes.js         # Patient API routes
│
├── 📁 scripts/
│   └── seedPatients.js          # Database seeder (5 sample patients)
│
├── 📄 .env                      # Environment variables (DO NOT COMMIT)
├── 📄 .env.example              # Environment variables template
├── 📄 .gitignore                # Git ignore rules
├── 📄 package.json              # NPM dependencies and scripts
├── 📄 package-lock.json         # NPM lock file
├── 📄 server.js                 # Main entry point
├── 📄 README.md                 # Main documentation (English)
└── 📄 QUICKSTART.md             # Quick start guide (Thai)
```

## 📊 File Statistics

- **Total Files**: 16 files
- **Total Directories**: 8 directories
- **Models**: 2 (User, Patient)
- **Controllers**: 2 (User, Patient)
- **Routes**: 2 (User, Patient)
- **Middleware**: 2 (Error Handler, Logger)
- **Documentation**: 3 files
- **Scripts**: 1 (Seeder)

## 🔑 Key Files

### Entry Point
- **server.js** - Main application entry point, Express setup, middleware configuration

### Configuration
- **.env** - Environment variables (PORT, MONGODB_URI, CORS_ORIGIN)
- **config/database.js** - MongoDB connection with Mongoose

### Models (Mongoose Schemas)
- **models/User.js** - User authentication and management
- **models/Patient.js** - Comprehensive patient medical records

### Controllers (Business Logic)
- **controllers/userController.js** - User CRUD operations
- **controllers/patientController.js** - Patient CRUD + search + statistics

### Routes (API Endpoints)
- **routes/userRoutes.js** - `/api/users/*`
- **routes/patientRoutes.js** - `/api/patients/*`

### Middleware
- **middleware/errorHandler.js** - Centralized error handling
- **middleware/logger.js** - HTTP request logging with colored output

### Documentation
- **README.md** - Main documentation (English)
- **QUICKSTART.md** - Quick start guide (Thai)
- **docs/PATIENT_SCHEMA.md** - Detailed patient schema documentation

### Scripts
- **scripts/seedPatients.js** - Populate database with sample data

## 🚀 Available NPM Scripts

```json
{
  "start": "node server.js",           // Production mode
  "dev": "nodemon server.js",          // Development mode (auto-reload)
  "seed": "node scripts/seedPatients.js", // Seed database
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## 📦 Dependencies

### Production Dependencies
- **express** (^4.18.2) - Web framework
- **mongoose** (^8.0.3) - MongoDB ODM
- **dotenv** (^16.3.1) - Environment variables
- **cors** (^2.8.5) - CORS middleware
- **body-parser** (^1.20.2) - Request body parser
- **morgan** (^1.10.0) - HTTP logger

### Development Dependencies
- **nodemon** (^3.0.2) - Auto-reload on file changes

## 🌐 API Endpoints Summary

### Health Check
- `GET /` - Server status

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Patients
- `GET /api/patients` - List all patients (with filters)
- `GET /api/patients/:id` - Get patient by ID
- `GET /api/patients/an/:an` - Get patient by AN
- `GET /api/patients/stats/summary` - Get statistics
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

## 🎯 Features Implemented

✅ RESTful API architecture  
✅ MongoDB database integration  
✅ User management system  
✅ Comprehensive patient medical records  
✅ DRG coding support  
✅ ICD-10 diagnosis codes (pdx, sdx1-12)  
✅ ICD-10-PCS procedure codes (proc1-20)  
✅ Vital signs tracking  
✅ Medical history documentation  
✅ Length of stay calculation  
✅ Patient statistics and analytics  
✅ Error handling and validation  
✅ Request logging  
✅ CORS support  
✅ Database seeding  
✅ Comprehensive documentation  

## 📝 Notes

- Patient model supports up to 12 secondary diagnoses
- Patient model supports up to 20 procedure codes
- Length of stay is automatically calculated from admission and discharge dates
- All timestamps (createdAt, updatedAt) are managed automatically by Mongoose
- Virtual fields (calculatedAge, admissionDuration) are included in JSON responses
- Database indexes are created for optimal query performance
