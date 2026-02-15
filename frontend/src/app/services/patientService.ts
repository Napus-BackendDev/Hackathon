import apiClient from './api';

export interface Patient {
  _id: string;
  name: string;
  AN: string;
  dob: string;
  sex: string;
  age?: number;
  ageday?: number;
  dateadm: string;
  timeadm?: string;
  datedsc?: string;
  timedsc?: string;
  cc?: string;
  pi?: string;
  ph?: string;
  fh?: string;
  patient_examine?: string;
  bt?: string;
  pr?: string;
  rr?: string;
  bp?: string;
  o2?: string;
  pre_diagnosis?: string;
  reason_for_admit?: string;
  treatment_plan?: string;
  pdx?: string;
  sdx1?: string;
  sdx2?: string;
  sdx3?: string;
  sdx4?: string;
  sdx5?: string;
  sdx6?: string;
  sdx7?: string;
  sdx8?: string;
  sdx9?: string;
  sdx10?: string;
  sdx11?: string;
  sdx12?: string;
  proc1?: string;
  proc2?: string;
  proc3?: string;
  proc4?: string;
  proc5?: string;
  proc6?: string;
  proc7?: string;
  proc8?: string;
  proc9?: string;
  proc10?: string;
  proc11?: string;
  proc12?: string;
  proc13?: string;
  proc14?: string;
  proc15?: string;
  proc16?: string;
  proc17?: string;
  proc18?: string;
  proc19?: string;
  proc20?: string;
  drg?: string;
  rw?: number;
  wtlos?: number;
  adjrw?: number;
  lengthofstay?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientFilters {
  AN?: string;
  name?: string;
  pdx?: string;
  drg?: string;
  dateadm?: string;
}

export interface PatientResponse {
  success: boolean;
  count?: number;
  data: Patient | Patient[];
  message?: string;
}

export const patientService = {
  // Get all patients with optional filters
  async getAll(filters?: PatientFilters): Promise<Patient[]> {
    const response = await apiClient.get<PatientResponse>('/api/patients', {
      params: filters,
    });
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  // Get patient by ID
  async getById(id: string): Promise<Patient> {
    const response = await apiClient.get<PatientResponse>(`/api/patients/${id}`);
    return response.data.data as Patient;
  },

  // Get patient by AN (Admission Number)
  async getByAN(an: string): Promise<Patient> {
    const response = await apiClient.get<PatientResponse>(`/api/patients/an/${an}`);
    return response.data.data as Patient;
  },

  // Create new patient
  async create(patientData: Partial<Patient>): Promise<Patient> {
    const response = await apiClient.post<PatientResponse>('/api/patients', patientData);
    return response.data.data as Patient;
  },

  // Update patient
  async update(id: string, patientData: Partial<Patient>): Promise<Patient> {
    const response = await apiClient.put<PatientResponse>(`/api/patients/${id}`, patientData);
    return response.data.data as Patient;
  },

  // Delete patient
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/patients/${id}`);
  },

  // Get statistics
  async getStats(): Promise<any> {
    const response = await apiClient.get('/api/patients/stats/summary');
    return response.data.data;
  },
};
