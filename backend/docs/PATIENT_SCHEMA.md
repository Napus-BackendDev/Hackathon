# Patient Schema Documentation

## Overview
Patient model สำหรับระบบบันทึกข้อมูลผู้ป่วยในโรงพยาบาล รองรับการบันทึกข้อมูลทางการแพทย์แบบครบถ้วน รวมถึง diagnosis codes, procedure codes และ DRG coding

## Schema Fields

### Patient Demographics (ข้อมูลผู้ป่วย)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | ชื่อ-นามสกุลผู้ป่วย |
| `AN` | String | Yes | Admission Number (เลขที่ Admit) - ต้องไม่ซ้ำ |
| `dob` | Date | Yes | วันเกิด (Date of Birth) |
| `sex` | String | Yes | เพศ (M, F, male, female, other) |

### Admission Information (ข้อมูลการรับเข้า-จำหน่าย)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `dateadm` | Date | Yes | วันที่รับเข้า (Admission Date) |
| `timeadm` | String | No | เวลารับเข้า |
| `datedsc` | Date | No | วันที่จำหน่าย (Discharge Date) |
| `timedsc` | String | No | เวลาจำหน่าย |

### Age Information (ข้อมูลอายุ)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `age` | Number | No | อายุ (ปี) |
| `ageday` | Number | No | อายุ (วัน) - สำหรับทารก |

### Medical History (ประวัติทางการแพทย์)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cc` | String | No | Chief Complaint - อาการสำคัญที่มาพบแพทย์ |
| `pi` | String | No | Present Illness - ประวัติการเจ็บป่วยปัจจุบัน |
| `ph` | String | No | Past History - ประวัติการเจ็บป่วยในอดีต |
| `fh` | String | No | Family History - ประวัติครอบครัว |

### Physical Examination (การตรวจร่างกาย)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient_examine` | String | No | ผลการตรวจร่างกาย |

### Vital Signs (สัญญาณชีพ)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bt` | String | No | Body Temperature - อุณหภูมิร่างกาย |
| `pr` | String | No | Pulse Rate - อัตราการเต้นของหัวใจ |
| `rr` | String | No | Respiratory Rate - อัตราการหายใจ |
| `bp` | String | No | Blood Pressure - ความดันโลหิต |
| `o2` | String | No | Oxygen Saturation - ออกซิเจนในเลือด |

### Diagnosis and Treatment (การวินิจฉัยและรักษา)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pre_diagnosis` | String | No | การวินิจฉัยเบื้องต้น |
| `reason_for_admit` | String | No | เหตุผลในการรับเข้า |
| `treatment_plan` | String | No | แผนการรักษา |

### Diagnosis Codes (รหัสการวินิจฉัยโรค - ICD-10)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pdx` | String | No | Principal Diagnosis - การวินิจฉัยหลัก |
| `sdx1` - `sdx12` | String | No | Secondary Diagnosis - การวินิจฉัยรอง (12 รายการ) |

### Procedure Codes (รหัสหัตถการ - ICD-10-PCS)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `proc1` - `proc20` | String | No | Procedure Codes - รหัสหัตถการ (20 รายการ) |

### DRG Information (ข้อมูล DRG)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `drg` | String | No | DRG Code - รหัส DRG |
| `rw` | Number | No | Relative Weight - น้ำหนักสัมพัทธ์ |
| `wtlos` | Number | No | Weight Length of Stay |
| `adjrw` | Number | No | Adjusted Relative Weight |
| `lengthofstay` | Number | No | Length of Stay - จำนวนวันนอน (คำนวณอัตโนมัติ) |

### System Fields (ฟิลด์ระบบ)
| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | Date | วันที่สร้างข้อมูล (auto) |
| `updatedAt` | Date | วันที่แก้ไขข้อมูลล่าสุด (auto) |

## Virtual Fields (ฟิลด์คำนวณ)
| Field | Type | Description |
|-------|------|-------------|
| `calculatedAge` | Number | อายุคำนวณจาก dob |
| `admissionDuration` | Number | จำนวนวันนอนคำนวณจาก dateadm และ datedsc |

## Indexes (ดัชนี)
- `AN` - Unique index
- `name` - Index for search
- `dateadm` - Index for date queries
- `datedsc` - Index for date queries
- `pdx` - Index for diagnosis queries
- `drg` - Index for DRG queries

## Pre-save Hooks
- คำนวณ `lengthofstay` อัตโนมัติถ้ามี `dateadm` และ `datedsc` แต่ไม่มี `lengthofstay`

## Example Usage

### สร้างผู้ป่วยใหม่
```javascript
const patient = await Patient.create({
  name: "นายสมชาย ใจดี",
  AN: "AN2024001234",
  dob: "1985-03-15",
  sex: "M",
  dateadm: "2024-02-14",
  timeadm: "14:30",
  age: 39,
  cc: "Chest pain",
  pi: "Patient presented with acute chest pain for 2 hours",
  bt: "37.2",
  pr: "85",
  rr: "18",
  bp: "130/85",
  o2: "98",
  pre_diagnosis: "Acute coronary syndrome",
  reason_for_admit: "Chest pain evaluation",
  pdx: "I21.9",
  sdx1: "E11.9",
  proc1: "0BH17EZ",
  drg: "280",
  rw: 1.5432
});
```

### ค้นหาผู้ป่วยตาม AN
```javascript
const patient = await Patient.findOne({ AN: "AN2024001234" });
```

### ค้นหาผู้ป่วยตาม DRG
```javascript
const patients = await Patient.find({ drg: "280" });
```

### อัพเดทข้อมูลการจำหน่าย
```javascript
const patient = await Patient.findByIdAndUpdate(
  patientId,
  {
    datedsc: "2024-02-20",
    timedsc: "10:00"
  },
  { new: true }
);
// lengthofstay จะถูกคำนวณอัตโนมัติ
```

## Notes
- AN (Admission Number) ต้องไม่ซ้ำกัน
- ระบบจะคำนวณ `lengthofstay` อัตโนมัติเมื่อมีทั้ง `dateadm` และ `datedsc`
- Diagnosis codes (pdx, sdx) ควรใช้รหัส ICD-10
- Procedure codes (proc) ควรใช้รหัส ICD-10-PCS
- Virtual fields (`calculatedAge`, `admissionDuration`) จะถูกรวมใน JSON response
