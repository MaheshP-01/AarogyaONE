import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { ClinicalLayout } from './layouts/ClinicalLayout';
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
          <Route path="/patient" element={<Navigate to="/patients/register" replace />} />
        </Route>

        {/* Clinical Application Portal */}
        <Route element={<ClinicalLayout />}>
          {/* Health Worker Dashboard Portal */}
          <Route path="/health-worker" element={<HealthWorkerPage />} />

          {/* Dedicated Patient Registration Tab / Page */}
          <Route path="/patients/register" element={<PatientRegistrationPage />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
