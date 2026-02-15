# Backend API Integration Guide

## สรุปการเปลี่ยนแปลง

ระบบได้ถูกอัพเดทให้ใช้ข้อมูลจาก **Backend API** แทนข้อมูล mockup แล้ว

## ไฟล์ที่สร้างใหม่

### 1. `src/app/services/api.ts`
- Axios instance configuration
- Request/Response interceptors
- Authentication token handling
- Error handling

### 2. `src/app/services/patientService.ts`
- Patient CRUD operations
- Type definitions สำหรับ Patient data
- API endpoints:
  - `GET /api/patients` - ดึงรายการผู้ป่วยทั้งหมด
  - `GET /api/patients/:id` - ดึงข้อมูลผู้ป่วยตาม ID
  - `GET /api/patients/an/:an` - ดึงข้อมูลผู้ป่วยตาม AN
  - `POST /api/patients` - เพิ่มผู้ป่วยใหม่
  - `PUT /api/patients/:id` - แก้ไขข้อมูลผู้ป่วย
  - `DELETE /api/patients/:id` - ลบข้อมูลผู้ป่วย
  - `GET /api/patients/stats/summary` - ดึงสถิติ

### 3. `src/vite-env.d.ts`
- Type definitions สำหรับ Vite environment variables
- กำหนด `VITE_API_URL` type

## ไฟล์ที่แก้ไข

### `src/app/context/DataContext.tsx`
**การเปลี่ยนแปลงหลัก:**

1. **เพิ่ม State ใหม่:**
   - `loading: boolean` - สถานะการโหลดข้อมูล
   - `error: string | null` - ข้อความ error
   - `refreshRecords()` - ฟังก์ชันสำหรับโหลดข้อมูลใหม่

2. **Data Mapping:**
   - สร้างฟังก์ชัน `mapPatientToRecord()` เพื่อแปลงข้อมูลจาก Backend API
   - Map ข้อมูลผู้ป่วยจาก Backend schema ไปเป็น `PatientRecord` interface
   - แปลง:
     - `_id` → `id`
     - `name` → `patientName`
     - `AN` → `mrn` (Medical Record Number)
     - `dateadm` → `dateOfService`
     - `pdx, sdx1-12` → `codes` (ICD-10)
     - `proc1-20` → `codes` (CPT)
     - `cc, pi, ph, patient_examine, pre_diagnosis` → `clinicalNote`

3. **Auto-fetch on Mount:**
   - ใช้ `useEffect` เพื่อโหลดข้อมูลจาก API เมื่อ component mount
   - แสดง loading state ขณะโหลด
   - จัดการ error ถ้าโหลดไม่สำเร็จ

4. **Audit Logging:**
   - บันทึก log เมื่อโหลดข้อมูลสำเร็จ
   - บันทึก log เมื่อเกิด error
   - บันทึก log เมื่อมีการแก้ไขข้อมูล

## การตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

## วิธีใช้งาน

### 1. ติดตั้ง Dependencies

```bash
cd frontend
npm install
```

### 2. เริ่ม Backend Server

```bash
cd backend
npm run dev
```

Backend จะรันที่ `http://localhost:5000`

### 3. เริ่ม Frontend

```bash
cd frontend
npm run dev
```

Frontend จะรันที่ `http://localhost:5173`

## Data Flow

```
Frontend Component
    ↓
useData() Hook
    ↓
DataContext
    ↓
patientService
    ↓
API Client (axios)
    ↓
Backend API (http://localhost:5000)
    ↓
MongoDB
```

## การจัดการ State

### Loading State
```typescript
const { loading, error, records } = useData();

if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>Error: {error}</div>;
}
```

### Refresh Data
```typescript
const { refreshRecords } = useData();

// เรียกใช้เมื่อต้องการโหลดข้อมูลใหม่
await refreshRecords();
```

## ข้อมูลที่ Map

### Backend Patient Schema → Frontend PatientRecord

| Backend Field | Frontend Field | Description |
|--------------|----------------|-------------|
| `_id` | `id` | Patient ID |
| `name` | `patientName` | ชื่อผู้ป่วย |
| `AN` | `mrn` | Medical Record Number |
| `dateadm` | `dateOfService` | วันที่รับเข้า |
| `pdx` | `codes[0]` | Principal Diagnosis (ICD-10) |
| `sdx1-12` | `codes[1-12]` | Secondary Diagnoses (ICD-10) |
| `proc1-20` | `codes[13-32]` | Procedures (CPT) |
| `cc, pi, ph, etc.` | `clinicalNote` | Clinical notes |
| `datedsc` | `status` | COMPLETED ถ้ามี, PENDING ถ้าไม่มี |

### Status Mapping

- `PENDING` - ผู้ป่วยที่ยังไม่มี codes และยังไม่จำหน่าย
- `IN_REVIEW` - ผู้ป่วยที่มี codes แล้วแต่ยังไม่จำหน่าย
- `COMPLETED` - ผู้ป่วยที่จำหน่ายแล้ว (มี `datedsc`)
- `FLAGGED` - ผู้ป่วยที่ถูก flag โดย user

## Error Handling

### API Errors
- แสดง error message ใน UI
- บันทึก error log
- ไม่ crash application

### Network Errors
- แสดง network error message
- Retry mechanism (ถ้าต้องการ)

### Authentication Errors (401)
- ลบ auth token
- Redirect ไปหน้า login

## ข้อควรระวัง

1. **Backend ต้องรันก่อน** - Frontend จะ error ถ้า Backend ไม่รัน
2. **CORS** - Backend ต้อง enable CORS สำหรับ `http://localhost:5173`
3. **Data Format** - Backend ต้องส่งข้อมูลตาม schema ที่กำหนด
4. **Loading State** - ต้องจัดการ loading state ใน UI

## ตัวอย่างการใช้งานใน Component

```typescript
import { useData } from '../context/DataContext';

function MyComponent() {
  const { records, loading, error, refreshRecords } = useData();

  if (loading) {
    return <div>Loading patients...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={refreshRecords}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Patients ({records.length})</h1>
      <button onClick={refreshRecords}>Refresh</button>
      {records.map(record => (
        <div key={record.id}>
          <h3>{record.patientName}</h3>
          <p>MRN: {record.mrn}</p>
          <p>Status: {record.status}</p>
        </div>
      ))}
    </div>
  );
}
```

## Troubleshooting

### ปัญหา: Cannot connect to backend
**แก้ไข:**
- ตรวจสอบว่า backend รันอยู่ที่ `http://localhost:5000`
- ตรวจสอบ `.env` file
- ตรวจสอบ CORS settings ใน backend

### ปัญหา: Data ไม่แสดง
**แก้ไข:**
- เปิด Browser DevTools → Network tab
- ตรวจสอบ API response
- ตรวจสอบ Console สำหรับ errors

### ปัญหา: TypeScript errors
**แก้ไข:**
- รัน `npm install` ใหม่
- ตรวจสอบว่ามี `axios` ใน dependencies
- ตรวจสอบ `src/vite-env.d.ts` file

## Next Steps

1. เพิ่ม Authentication
2. เพิ่ม Error Boundary
3. เพิ่ม Loading Skeleton
4. เพิ่ม Retry Logic
5. เพิ่ม Caching
6. เพิ่ม Optimistic Updates

---

**หมายเหตุ:** ระบบตอนนี้ใช้ข้อมูลจริงจาก Backend API แล้ว ไม่ใช่ mockup data อีกต่อไป
