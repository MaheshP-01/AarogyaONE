import React, { useState, useEffect } from 'react';
import { Menu, X, Bell, Search, LogOut, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageCode } from '../../types';
import { TranslationDictionary } from '../../utils/translations';
import { CommandPalette } from './CommandPalette';
import { NotificationDrawer } from './NotificationDrawer';

interface DoctorHeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  t: TranslationDictionary;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  isOnline,
  onToggleOnline,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [availability, setAvailability] = useState<'available' | 'busy' | 'rounds'>('available');

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute clean breadcrumb
  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p === '/doctor') return 'Clinical Overview';
    if (p === '/doctor/queue') return 'Consultation Queue';
    if (p === '/doctor/patients') return 'Patient Directory';
    if (p.startsWith('/doctor/patients/')) return 'Patient Clinical Record';
    if (p.startsWith('/doctor/consultation/')) return 'Consultation Workspace';
    if (p.startsWith('/doctor/teleconsultation')) return 'Teleconsultation Session';
    if (p.startsWith('/doctor/referrals')) return 'Referral Management';
    if (p.startsWith('/doctor/follow-ups')) return 'Follow-up Management';
    if (p === '/doctor/settings') return 'Workstation Preferences';
    return 'Workstation';
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200">
        <div className="w-full px-4 sm:px-6 h-13 flex items-center justify-between">
          {/* Left: Mobile Toggle + Breadcrumb */}
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="flex items-center space-x-2 text-xs font-medium text-slate-600">
              <Link
                to="/doctor"
                className="text-slate-400 hover:text-slate-800 transition-colors font-medium hidden sm:inline"
              >
                Workstation
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
              <span className="font-semibold text-slate-900 truncate">
                {getBreadcrumb()}
              </span>
            </div>
          </div>

          {/* Right: Search, Notifications, Language, Doctor Profile */}
          <div className="flex items-center space-x-3">
            {/* Global Search Button with ⌘K / Ctrl+K badge */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search patient...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
              title="Clinical alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>

            {/* Compact Language Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
              {(['en', 'mr', 'hi'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2 py-0.5 rounded font-medium transition-all ${
                    currentLanguage === lang
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
                </button>
              ))}
            </div>

            {/* Connectivity Badge */}
            <button
              type="button"
              onClick={onToggleOnline}
              className="hidden lg:flex items-center space-x-1.5 px-2 py-1 rounded text-xs border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
              title="Click to simulate network status toggle"
            >
              <span
                className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-600' : 'bg-amber-600'}`}
              />
              <span className="text-[11px] text-slate-600">
                {isOnline ? 'Online' : 'Offline Mode'}
              </span>
            </button>

            {/* Doctor Profile Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 rounded hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                  AS
                </div>
                <div className="hidden xl:block text-left text-xs">
                  <div className="font-semibold text-slate-900 leading-tight">Dr. Anjali Sharma</div>
                  <div className="text-[10px] text-slate-500 leading-tight">General Physician</div>
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900">Dr. Anjali Sharma</div>
                      <div className="text-slate-500 text-[11px]">MCI Reg: 2018/04/1042</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">District Civil Hospital, Dhule</div>
                    </div>

                    <div className="px-3 py-2 border-b border-slate-100">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                        Availability Status
                      </span>
                      <div className="space-y-1">
                        {[
                          { id: 'available', label: 'Online / Available', color: 'bg-emerald-600' },
                          { id: 'busy', label: 'In Consultation', color: 'bg-amber-600' },
                          { id: 'rounds', label: 'On Ward Rounds', color: 'bg-blue-600' },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setAvailability(s.id as any);
                              setIsProfileOpen(false);
                            }}
                            className={`w-full flex items-center space-x-2 px-2 py-1 rounded text-left ${
                              availability === s.id ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${s.color}`} />
                            <span>{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/doctor/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
                      >
                        <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Workstation Settings</span>
                      </Link>
                      <Link
                        to="/"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-3 py-1.5 text-slate-700 hover:bg-slate-100"
                      >
                        <LogOut className="w-3.5 h-3.5 text-slate-400" />
                        <span>Exit Workstation</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Notification Slide-Over Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
};
