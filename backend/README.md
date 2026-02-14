# Napus Backend (Express + MongoDB)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   - Make sure MongoDB is running locally on port 27017.
   - Or update `MONGO_URI` in `.env`.
   - `PORT` defaults to 8000.

## Start

- Development (auto-reload):
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm start
  ```

## API

- **GET /patients**: List all patients
- **GET /patients/:id**: Get patient by ID
- **POST /patients**: Create patient
- **PATCH /patients/:id**: Update patient
- **DELETE /patients/:id**: Delete patient
