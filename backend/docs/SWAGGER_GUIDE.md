# 📚 Swagger API Documentation Guide

## เข้าถึง Swagger UI

เมื่อ server รันแล้ว คุณสามารถเข้าถึง **Swagger UI** (Interactive API Documentation) ได้ที่:

```
http://localhost:5000/api-docs
```

## ฟีเจอร์ของ Swagger UI

### 🎯 ทดสอบ API แบบ Interactive
- **Try it out** - ทดสอบ API endpoints โดยตรงจากเบราว์เซอร์
- **Execute** - ส่ง request และดูผลลัพธ์แบบ real-time
- **Response** - ดู response body, headers, และ status code

### 📖 Documentation ครบถ้วน
- **Request Parameters** - ดูรายละเอียด query parameters, path parameters
- **Request Body** - ดู schema และ example ของ request body
- **Response Schema** - ดูโครงสร้างของ response
- **Examples** - ตัวอย่างข้อมูลสำหรับทุก endpoint

### 🏷️ Tags (หมวดหมู่)
API endpoints ถูกจัดกลุ่มตาม tags:
- **Health** - Health check endpoint
- **Users** - User management endpoints
- **Patients** - Patient management endpoints

## วิธีใช้งาน Swagger UI

### 1. เปิด Swagger UI
```
http://localhost:5000/api-docs
```

### 2. เลือก Endpoint ที่ต้องการทดสอบ
คลิกที่ endpoint ที่ต้องการ เช่น `GET /api/patients`

### 3. คลิก "Try it out"
ปุ่มนี้จะเปิดให้คุณกรอกข้อมูล parameters หรือ request body

### 4. กรอกข้อมูล (ถ้ามี)
- **Query Parameters** - เช่น `name=สมชาย`, `drg=280`
- **Path Parameters** - เช่น `id=507f1f77bcf86cd799439011`
- **Request Body** - กรอก JSON data

### 5. คลิก "Execute"
Swagger จะส่ง request ไปยัง API และแสดงผลลัพธ์

### 6. ดูผลลัพธ์
- **Response body** - ข้อมูลที่ได้รับกลับมา
- **Response headers** - HTTP headers
- **Response code** - HTTP status code (200, 201, 404, 500, etc.)

## ตัวอย่างการใช้งาน

### ทดสอบ GET /api/patients
1. เปิด Swagger UI
2. หา endpoint `GET /api/patients`
3. คลิก "Try it out"
4. (Optional) กรอก query parameters:
   - `name`: สมชาย
   - `drg`: 280
5. คลิก "Execute"
6. ดูผลลัพธ์ใน Response section

### ทดสอบ POST /api/patients
1. เปิด Swagger UI
2. หา endpoint `POST /api/patients`
3. คลิก "Try it out"
4. แก้ไข Request body (JSON):
```json
{
  "name": "นายทดสอบ ระบบ",
  "AN": "AN2024999999",
  "dob": "1990-01-01",
  "sex": "M",
  "dateadm": "2024-02-14",
  "age": 34,
  "cc": "Fever",
  "pdx": "J18.9",
  "drg": "195"
}
```
5. คลิก "Execute"
6. ดูผลลัพธ์ - ถ้าสำเร็จจะได้ status code 201

### ทดสอบ GET /api/patients/{id}
1. เปิด Swagger UI
2. หา endpoint `GET /api/patients/{id}`
3. คลิก "Try it out"
4. กรอก `id` parameter (ใช้ ID จากผลลัพธ์ของ GET /api/patients)
5. คลิก "Execute"
6. ดูข้อมูลผู้ป่วยรายเดียว

## Swagger Schema

Swagger มี schema ที่กำหนดไว้สำหรับ:

### User Schema
- name, email, password, role, isActive
- timestamps (createdAt, updatedAt)

### Patient Schema
- **Demographics**: name, AN, dob, sex
- **Admission**: dateadm, timeadm, datedsc, timedsc
- **Age**: age, ageday
- **Medical History**: cc, pi, ph, fh
- **Physical Exam**: patient_examine
- **Vital Signs**: bt, pr, rr, bp, o2
- **Diagnosis**: pre_diagnosis, reason_for_admit, treatment_plan
- **Diagnosis Codes**: pdx, sdx1-12
- **Procedure Codes**: proc1-20
- **DRG**: drg, rw, wtlos, adjrw, lengthofstay
- **Timestamps**: createdAt, updatedAt

## Tips & Tricks

### 💡 ใช้ Examples
Swagger มี example values ให้สำหรับทุกฟิลด์ คุณสามารถใช้ค่าเหล่านี้เป็นแนวทางในการกรอกข้อมูล

### 💡 ดู Response Schema
ก่อนส่ง request ควรดู Response Schema เพื่อเข้าใจโครงสร้างของข้อมูลที่จะได้รับ

### 💡 ใช้ cURL
Swagger UI แสดง cURL command ที่คุณสามารถ copy ไปใช้ใน terminal ได้

### 💡 ดาวน์โหลด OpenAPI Spec
คุณสามารถดาวน์โหลด OpenAPI specification (JSON/YAML) จาก:
```
http://localhost:5000/api-docs.json
```

## Swagger Configuration

ไฟล์ configuration อยู่ที่:
```
backend/config/swagger.js
```

คุณสามารถแก้ไข:
- API title และ description
- Server URLs
- Tags และ descriptions
- Schemas และ components

## ประโยชน์ของ Swagger

✅ **ทดสอบ API ได้ทันที** - ไม่ต้องใช้ Postman หรือ cURL  
✅ **Documentation อัตโนมัติ** - อัพเดทตาม code  
✅ **เข้าใจ API ง่ายขึ้น** - มี examples และ schemas  
✅ **Share ได้ง่าย** - ส่ง URL ให้ทีมดูได้เลย  
✅ **Generate Client Code** - สามารถ generate client libraries ได้  

## Troubleshooting

### Swagger UI ไม่แสดง
- ตรวจสอบว่า server รันอยู่
- ตรวจสอบว่าติดตั้ง `swagger-ui-express` และ `swagger-jsdoc` แล้ว
- ลอง clear browser cache

### API ไม่แสดงใน Swagger
- ตรวจสอบว่ามี JSDoc comments (`/** @swagger */`) ใน routes
- ตรวจสอบ `apis` path ใน `config/swagger.js`
- Restart server

### Try it out ไม่ทำงาน
- ตรวจสอบ CORS settings
- ตรวจสอบว่า server URL ถูกต้อง
- ดู browser console สำหรับ errors

## เอกสารเพิ่มเติม

- [Swagger Official Docs](https://swagger.io/docs/)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
- [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)
