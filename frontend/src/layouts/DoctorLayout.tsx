import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DoctorHeader } from '../components/doctor/DoctorHeader';
import { DoctorSidebar } from '../components/doctor/DoctorSidebar';
import { useLanguage } from '../hooks/useLanguage';
import { TRANSLATIONS } from '../utils/translations';
import { doctorMockService } from '../services/doctorMockService';

export const DoctorLayout: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const t = TRANSLATIONS[currentLanguage];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const kpis = doctorMockService.getKpiSummary();

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOnline = () => {
    setIsOnline((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      {/* Top Header */}
      <DoctorHeader
        currentLanguage={currentLanguage}
        onLanguageChange={changeLanguage}
        isOnline={isOnline}
        onToggleOnline={toggleOnline}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        t={t}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Compact Clinical Sidebar */}
        <DoctorSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          urgentCount={kpis.urgentCount}
          t={t}
        />

        {/* Clinical Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7">
          <Outlet context={{ currentLanguage, t, isOnline }} />
        </main>
      </div>
    </div>
  );
};
