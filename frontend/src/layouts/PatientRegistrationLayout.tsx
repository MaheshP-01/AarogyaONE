import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { TRANSLATIONS } from '../utils/translations';

export const PatientRegistrationLayout: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const t = TRANSLATIONS[currentLanguage];

  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Listen to browser network connectivity
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
      {/* Separate, dedicated Patient Portal Header */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Branding & Portal Subtitle */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Return to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  {t.appTitle}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-3xs font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200">
                  Patient Portal
                </span>
              </div>
              <p className="text-2xs text-slate-500 font-medium">
                Digital Health Registration & Longitudinal Records
              </p>
            </div>
          </div>

          {/* Right: Network Status + Language Selector + Home Link */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Network Indicator (Offline-ready) */}
            <button
              type="button"
              onClick={toggleOnline}
              title={isOnline ? 'Online — click to simulate offline mode' : 'Offline — click to simulate online mode'}
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                isOnline
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="hidden md:inline">
                {isOnline ? t.onlineStatus : t.offlineStatus}
              </span>
              <span className="md:hidden">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </button>

            {/* Language Selector: EN / MR / HI */}
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium text-slate-700">
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  currentLanguage === 'en'
                    ? 'bg-white text-teal-800 font-bold shadow-2xs'
                    : 'hover:text-slate-900 text-slate-600'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('mr')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  currentLanguage === 'mr'
                    ? 'bg-white text-teal-800 font-bold shadow-2xs'
                    : 'hover:text-slate-900 text-slate-600'
                }`}
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('hi')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  currentLanguage === 'hi'
                    ? 'bg-white text-teal-800 font-bold shadow-2xs'
                    : 'hover:text-slate-900 text-slate-600'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Home link */}
            <Link
              to="/"
              className="hidden sm:inline-flex items-center space-x-1 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container without the Health Worker sidebar */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet context={{ currentLanguage, t, isOnline }} />
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-2xs text-slate-400">
        <p>ArogyaOne • Citizen Digital Health Portal • Maharashtra PHC Network</p>
      </footer>
    </div>
  );
};
