import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, UserRole } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Login } from './pages/Login';
import { AppLayout } from './components/layout/AppLayout';
import { CoderDashboard } from './pages/coder/CoderDashboard';
import { PatientRecords as CoderPatientRecords } from './pages/coder/PatientRecords';
import { CoderCaseWorkspace } from './pages/coder/CoderCaseWorkspace';
import { CodingCalculation } from './pages/coder/CodingCalculation';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { SystemConfig } from './pages/admin/SystemConfig';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorClinicalNotes } from './pages/doctor/DoctorClinicalNotes';
import { DoctorPatientList } from './pages/doctor/DoctorPatientList';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { Toaster } from 'sonner';

import { DoctorPatientDetail } from './pages/doctor/DoctorPatientDetail';
import { DoctorSettings } from './pages/doctor/DoctorSettings';
import { PatientRecords } from './pages/patient/PatientRecords';
import { PatientBilling } from './pages/patient/PatientBilling';
import { Home } from './pages/Home';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: UserRole[] }) => {
  // Direct access - no authentication required
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Coder Routes */}
            <Route path="/coder" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CoderDashboard />} />
              <Route path="records" element={<CoderPatientRecords />} />
              
              {/* Detailed Patient Case Workspace (Linked from Records) */}
              <Route path="coding/:id" element={<CoderCaseWorkspace />} />
              
              {/* New Calculation & Entry Workspace (Accessible from Sidebar) */}
              <Route path="calculation" element={<CodingCalculation />} />
              <Route path="calculation/:id" element={<CodingCalculation />} /> {/* Optional ID support */}
              
              {/* Admin Routes nested for Coder */}
              <Route path="admin/users" element={<UserManagement />} />
              <Route path="admin/config" element={<SystemConfig />} />
              <Route path="admin/logs" element={<div className="p-8 text-center text-slate-500">Security Logs</div>} />
              
              <Route path="*" element={<div className="p-8 text-center text-slate-500">Feature coming soon</div>} />
            </Route>

            {/* Doctor Routes */}
            <Route path="/doctor" element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="patients" element={<DoctorPatientList />} /> 
              <Route path="patients/:id" element={<DoctorPatientDetail />} />
              <Route path="notes" element={<DoctorClinicalNotes />} />
              <Route path="settings" element={<DoctorSettings />} />
              <Route path="*" element={<div className="p-8 text-center text-slate-500">Feature coming soon</div>} />
            </Route>

            {/* Patient Routes */}
            <Route path="/patient" element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="records" element={<PatientRecords />} />
              <Route path="billing" element={<PatientBilling />} />
              <Route path="*" element={<div className="p-8 text-center text-slate-500">Feature coming soon</div>} />
            </Route>

          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
