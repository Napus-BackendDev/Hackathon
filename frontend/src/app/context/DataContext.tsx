import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface CodeRecord {
  code: string;
  description: string;
  confidence: number;
}

export interface PatientRecord {
  id: string;
  patientName: string;
  mrn: string;
  dateOfService: string;
  department: string;
  provider: string;
  status: 'PENDING' | 'IN_REVIEW' | 'COMPLETED' | 'FLAGGED';
  codes: CodeRecord[];
  // Optional fields from backend
  clinicalNote?: string;
  originalData?: {
    age?: number;
    sex?: 'M' | 'F';
    [key: string]: any;
  };
}

interface DataContextType {
  records: PatientRecord[];
  loading: boolean;
  error: string | null;
  refreshRecords: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock patient data
const generateMockRecords = (): PatientRecord[] => [
  {
    id: '1',
    patientName: 'Eleanor Rigby',
    mrn: 'HN-99281',
    dateOfService: '2024-10-10',
    department: 'Respiratory',
    provider: 'Dr. Sarah Mitchell',
    status: 'COMPLETED',
    codes: [
      { code: 'J18.9', description: 'Pneumonia, unspecified organism', confidence: 0.95 },
      { code: 'I10', description: 'Essential hypertension', confidence: 0.88 },
      { code: 'E11.9', description: 'Type 2 diabetes mellitus', confidence: 0.85 }
    ]
  },
  {
    id: '2',
    patientName: 'Michael Chen',
    mrn: 'HN-99102',
    dateOfService: '2024-10-12',
    department: 'Cardiology',
    provider: 'Dr. James Wilson',
    status: 'PENDING',
    codes: [
      { code: '99223', description: 'Initial hospital care, high complexity', confidence: 0.90 }
    ]
  },
  {
    id: '3',
    patientName: 'John Smith',
    mrn: 'HN-99103',
    dateOfService: '2024-10-11',
    department: 'General Surgery',
    provider: 'Dr. Emily Stones',
    status: 'IN_REVIEW',
    codes: [
      { code: '47562', description: 'Laparoscopic cholecystectomy', confidence: 0.92 },
      { code: '99223', description: 'Initial hospital care', confidence: 0.88 }
    ]
  },
  {
    id: '4',
    patientName: 'Maria Garcia',
    mrn: 'HN-99104',
    dateOfService: '2024-10-09',
    department: 'Orthopedic',
    provider: 'Dr. Robert Johnson',
    status: 'FLAGGED',
    codes: [
      { code: '99223', description: 'Initial hospital care', confidence: 0.85 }
    ]
  },
  {
    id: '5',
    patientName: 'David Wong',
    mrn: 'HN-99105',
    dateOfService: '2024-10-13',
    department: 'Neurology',
    provider: 'Dr. Lisa Anderson',
    status: 'COMPLETED',
    codes: [
      { code: '99223', description: 'Initial hospital care', confidence: 0.91 },
      { code: 'I63.9', description: 'Cerebral infarction, unspecified', confidence: 0.87 }
    ]
  },
  {
    id: '6',
    patientName: 'Patricia Brown',
    mrn: 'HN-99106',
    dateOfService: '2024-10-08',
    department: 'Psychiatry',
    provider: 'Dr. Thomas Moore',
    status: 'PENDING',
    codes: [
      { code: 'F32.9', description: 'Major depressive disorder', confidence: 0.83 }
    ]
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API Base URL - adjust as needed
  const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

  // Map backend patient data to frontend PatientRecord format
  const mapBackendToFrontend = (backendPatient: any): PatientRecord => {
    // Collect all codes (PDX + SDX + PROC)
    const codes: CodeRecord[] = [];
    
    // Add Primary Diagnosis
    if (backendPatient.pdx) {
      codes.push({
        code: backendPatient.pdx,
        description: backendPatient.pdxDescription || 'Primary diagnosis',
        confidence: 0.95
      });
    }

    // Add Secondary Diagnoses (SDX1-12)
    for (let i = 1; i <= 12; i++) {
      const sdxKey = `sdx${i}`;
      if (backendPatient[sdxKey]) {
        codes.push({
          code: backendPatient[sdxKey],
          description: `Secondary diagnosis ${i}`,
          confidence: 0.85 + Math.random() * 0.1
        });
      }
    }

    // Add Procedures (PROC1-20)
    for (let i = 1; i <= 20; i++) {
      const procKey = `proc${i}`;
      if (backendPatient[procKey]) {
        codes.push({
          code: backendPatient[procKey],
          description: `Procedure ${i}`,
          confidence: 0.88 + Math.random() * 0.1
        });
      }
    }

    // Determine department based on PDX code pattern
    let department = 'General';
    if (backendPatient.pdx) {
      const pdx = backendPatient.pdx;
      if (/^(J|R)/.test(pdx)) department = 'Respiratory';
      else if (/^I/.test(pdx)) department = 'Cardiology';
      else if (/^G/.test(pdx)) department = 'Neurology';
      else if (/^(M|S)/.test(pdx)) department = 'Orthopedics';
    }

    // Determine status
    let status: 'PENDING' | 'IN_REVIEW' | 'COMPLETED' | 'FLAGGED' = 'PENDING';
    if (backendPatient.datedsc) {
      status = 'COMPLETED';
    } else if (backendPatient.pdx) {
      status = 'IN_REVIEW';
    } else {
      status = 'PENDING';
    }

    return {
      id: backendPatient._id || backendPatient.id,
      patientName: backendPatient.name || 'Unknown Patient',
      mrn: backendPatient.AN || 'N/A',
      dateOfService: backendPatient.dateadm || new Date().toISOString(),
      department,
      provider: backendPatient.doctor || 'Unknown Provider',
      status,
      codes
    };
  };

  // Fetch records from Backend API
  const refreshRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch from backend with cache-busting headers
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Prevent caching to avoid HTTP 304 responses
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Map backend data to frontend format
      const mappedRecords = data.data.map(mapBackendToFrontend);
      setRecords(mappedRecords);
    } catch (err) {
      console.error('Error fetching patient records:', err);
      setError(err instanceof Error ? err.message : 'Failed to load records');
      // Fallback to mock data in case of error (optional)
      setRecords(generateMockRecords());
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Load records on mount
  useEffect(() => {
    refreshRecords();
  }, [refreshRecords]);

  const value: DataContextType = {
    records,
    loading,
    error,
    refreshRecords
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
