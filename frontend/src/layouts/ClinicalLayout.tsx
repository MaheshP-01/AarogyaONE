import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { AppSidebar } from '../components/layout/AppSidebar';
import { useLanguage } from '../hooks/useLanguage';
import { TRANSLATIONS } from '../utils/translations';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const ClinicalLayout: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const t = TRANSLATIONS[currentLanguage];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

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
      <AppHeader
        currentLanguage={currentLanguage}
        onLanguageChange={changeLanguage}
        isOnline={isOnline}
        onToggleOnline={toggleOnline}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        t={t}
      />

      {/* Body Area with Sidebar and Main Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Compact Sidebar */}
        <AppSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          t={t}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <ErrorBoundary>
            <Outlet context={{ currentLanguage, t, isOnline }} />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
