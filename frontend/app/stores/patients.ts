import { defineStore } from 'pinia'

// Type definition matches backend/models.py
export type Patient = {
    id: number
    name: string
    mrn: string
    initial: string
    avatarColor: string
    age: number
    gender: string
    department: string
    date: string
    status: string
    statusColor: string
    aiScore: number
    aiLabel: string
    aiLabelColor: string
    
    // Medical Fields
    AN: string
    dob: string
    sex: string
    dateadm: string
    timeadm: string
    datedsc: string
    timedsc: string
    ageday: number
    cc: string
    pi: string
    ph: string
    fh: string
    patient_examine: string
    br: string
    pr: string
    rr: string
    bp: string
    o2: string
    pre_diagnosis: string
    reason_for_admit: string
    treatment_plan: string
    
    pdx: string
    sdx1: string
    sdx2: string
    sdx3: string
    sdx4: string
    proc1: string
    drg: string
    rw: number
    wtlos: number
    adjrw: number
    lengthofstay: number
}

export const usePatientsStore = defineStore('patients', {
  state: () => ({
    patients: [] as Patient[],
    currentPatient: null as Patient | null,
    loading: false,
    error: null as string | null,
  }),
  
  getters: {
    totalPatients: (state) => state.patients.length,
    
    todayCount: (state): string => {
        // For simplicity, returning total count as per previous logic, 
        // or filter by date if needed. 
        return state.patients.length.toString()
    },
    
    pendingCount: (state): string => {
        return state.patients.filter(p => p.status === 'Draft' || p.status === 'In Progress').length.toString()
    },
    
    completedCount: (state): string => {
        return state.patients.filter(p => p.status === 'Completed').length.toString()
    },

    getPatientById: (state) => {
        return (id: number) => state.patients.find((p) => p.id === id)
    }
  },
  
  actions: {
    async fetchPatients() {
      this.loading = true
      this.error = null
      try {
        console.log('Fetching patients from API...')
        const data = await $fetch<Patient[]>('http://localhost:8000/patients')
        
        if (data) {
            console.log('Patients data/API Response:', data)
            this.patients = data
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch patients'
        console.error('API Error:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchPatient(id: number) {
        this.loading = true
        this.error = null
        this.currentPatient = null
        
        // First check if we already have it in the list
        // Note: checking cache might prevent getting fresh data, but good for navigation speed
        const existing = this.patients.find(p => p.id === id)
        if (existing) {
            console.log(`Found patient ${id} in cache`)
            this.currentPatient = existing
            this.loading = false
            return
        }

        try {
            console.log(`Fetching patient ${id} from API...`)
            const data = await $fetch<Patient>(`http://localhost:8000/patients/${id}`)
            
            if (data) {
                console.log('Patient data/API Response:', data)
                this.currentPatient = data
            }
        } catch (err: any) {
            this.error = err.message || 'Failed to fetch patient'
            console.error('API Error:', err)
        } finally {
            this.loading = false
        }
    }
  }

})
