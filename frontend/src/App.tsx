import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { ClinicalLayout } from './layouts/ClinicalLayout';
import { PatientRegistrationLayout } from './layouts/PatientRegistrationLayout';
import { LandingPage } from './pages/LandingPage';
import { HealthWorkerPage } from './pages/HealthWorkerPage';
import { TriagePage } from './pages/health-worker/TriagePage';
import { AppointmentsPage } from './pages/health-worker/AppointmentsPage';
import { FollowUpsPage } from './pages/health-worker/FollowUpsPage';
import { PatientRegistrationPage } from './pages/PatientRegistrationPage';
import { DoctorLayout } from './layouts/DoctorLayout';
import { DoctorDashboardPage } from './pages/doctor/DoctorDashboardPage';
import { DoctorQueuePage } from './pages/doctor/DoctorQueuePage';
import { PatientDirectoryPage } from './pages/doctor/PatientDirectoryPage';
import { PatientClinicalWorkspacePage } from './pages/doctor/PatientClinicalWorkspacePage';
import { ConsultationWorkspacePage } from './pages/doctor/ConsultationWorkspacePage';
import { TeleconsultationPage } from './pages/doctor/TeleconsultationPage';
import { ReferralDashboardPage } from './pages/doctor/ReferralDashboardPage';
import { FollowUpDashboardPage } from './pages/doctor/FollowUpDashboardPage';
import { DoctorSettingsPage } from './pages/doctor/DoctorSettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Complete Doctor Portal Workstation (Dedicated Clinical Shell) */}
        <Route element={<DoctorLayout />}>
          <Route path="/doctor" element={<DoctorDashboardPage />} />
          <Route path="/doctor/queue" element={<DoctorQueuePage />} />
          <Route path="/doctor/patients" element={<PatientDirectoryPage />} />
          <Route path="/doctor/patients/:patientId" element={<PatientClinicalWorkspacePage />} />
          <Route path="/doctor/consultation/:consultationId" element={<ConsultationWorkspacePage />} />
          <Route path="/doctor/teleconsultation" element={<TeleconsultationPage />} />
          <Route path="/doctor/teleconsultation/:id" element={<TeleconsultationPage />} />
          <Route path="/doctor/referrals" element={<ReferralDashboardPage />} />
          <Route path="/doctor/referrals/new" element={<ReferralDashboardPage />} />
          <Route path="/doctor/follow-ups" element={<FollowUpDashboardPage />} />
          <Route path="/doctor/follow-up" element={<FollowUpDashboardPage />} />
          <Route path="/doctor/followup" element={<FollowUpDashboardPage />} />
          <Route path="/doctor/followups" element={<FollowUpDashboardPage />} />
          <Route path="/doctor/appointments" element={<Navigate to="/health-worker/appointments" replace />} />
          <Route path="/doctor/appointment" element={<Navigate to="/health-worker/appointments" replace />} />
          <Route path="/doctor/settings" element={<DoctorSettingsPage />} />
        </Route>

        {/* Health Worker Dashboard Portal (With Health Worker Station Sidebar) */}
        <Route element={<ClinicalLayout />}>
          <Route path="/health-worker" element={<HealthWorkerPage />} />
          <Route path="/health-worker/triage" element={<TriagePage />} />
          
          {/* Health Worker Appointment Routes (Plural & Singular) */}
          <Route path="/health-worker/appointments" element={<AppointmentsPage />} />
          <Route path="/health-worker/appointment" element={<AppointmentsPage />} />

          {/* Health Worker Follow-up Routes (All common spelling variations) */}
          <Route path="/health-worker/follow-ups" element={<FollowUpsPage />} />
          <Route path="/health-worker/follow-up" element={<FollowUpsPage />} />
          <Route path="/health-worker/followup" element={<FollowUpsPage />} />
          <Route path="/health-worker/followups" element={<FollowUpsPage />} />

          {/* Direct Root Shortcuts for Health Worker Modules */}
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointment" element={<AppointmentsPage />} />
          <Route path="/follow-ups" element={<FollowUpsPage />} />
          <Route path="/follow-up" element={<FollowUpsPage />} />
          <Route path="/followup" element={<FollowUpsPage />} />
          <Route path="/followups" element={<FollowUpsPage />} />
        </Route>

        {/* Completely Separate Patient Registration Portal (Without Health Worker Sidebar) */}
        <Route element={<PatientRegistrationLayout />}>
          <Route path="/patients/register" element={<PatientRegistrationPage />} />
          <Route path="/patient" element={<PatientRegistrationPage />} />
          <Route path="/register" element={<PatientRegistrationPage />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
