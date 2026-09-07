import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { ClinicalLayout } from './layouts/ClinicalLayout';
import { PatientRegistrationLayout } from './layouts/PatientRegistrationLayout';
import { LandingPage } from './pages/LandingPage';
import { HealthWorkerPage } from './pages/HealthWorkerPage';
import { PatientRegistrationPage } from './pages/PatientRegistrationPage';
import { DoctorPage } from './pages/DoctorPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Other Role Previews */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/doctor" element={<DoctorPage />} />
        </Route>

        {/* Health Worker Dashboard Portal (With Health Worker Station Sidebar) */}
        <Route element={<ClinicalLayout />}>
          <Route path="/health-worker" element={<HealthWorkerPage />} />
        </Route>

        {/* Completely Separate Patient Registration Portal (Without Health Worker Sidebar) */}
        <Route element={<PatientRegistrationLayout />}>
          <Route path="/patients/register" element={<PatientRegistrationPage />} />
          <Route path="/patient" element={<PatientRegistrationPage />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
