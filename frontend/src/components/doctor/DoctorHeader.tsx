import React, { useState } from 'react';
import { Menu, X, Bell, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageCode } from '../../types';
import { TranslationDictionary } from '../../utils/translations';

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
  t,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [availability, setAvailability] = useState<'available' | 'busy' | 'rounds'>('available');

  const notifications = [
    { id: 1, title: 'Urgent Triage Case Assigned', patient: 'Suresh Patil (SpO2 91%)', time: '18m ago', urgent: true },
    { id: 2, title: 'Referral Accepted', patient: 'Kavita Gawit by Dhule Civil Hospital', time: '1h ago' },
    { id: 3, title: 'Follow-up Scheduled Today', patient: '3 teleconsultations queued', time: '2h ago' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile sidebar toggle + Brand Identity */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <Link to="/doctor" className="text-base font-bold text-slate-900 tracking-tight hover:text-blue-900">
                {t.appTitle}
              </Link>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-3xs font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200">
                Doctor Workstation
              </span>
            </div>
            <p className="text-2xs text-slate-500 font-medium tracking-wide">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center space-x-2 sm:space-x-3.5">
          {/* Facility Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
            <span className="text-slate-400">Facility:</span>
            <span className="font-semibold text-slate-900">{t.doctorFacility}</span>
          </div>

          {/* Network Status Badge */}
          <button
            type="button"
            onClick={onToggleOnline}
            title={isOnline ? 'Online — click to simulate offline mode' : 'Offline — click to simulate online mode'}
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              isOnline
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="hidden sm:inline">{isOnline ? t.onlineStatus : t.offlineStatus}</span>
            <span className="sm:hidden">{isOnline ? 'Online' : 'Offline'}</span>
          </button>

          {/* Multilingual Selector */}
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium text-slate-700">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                currentLanguage === 'en' ? 'bg-white text-blue-800 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('mr')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                currentLanguage === 'mr' ? 'bg-white text-blue-800 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मराठी
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                currentLanguage === 'hi' ? 'bg-white text-blue-800 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Notifications Popover Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Clinical Alerts</span>
                  <span className="text-3xs text-blue-700 font-semibold cursor-pointer">Mark read</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-md text-xs border ${
                        n.urgent ? 'bg-red-50/50 border-red-200 text-red-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-2xs">{n.title}</span>
                        <span className="text-3xs text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-3xs mt-0.5 text-slate-600">{n.patient}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Doctor Profile Menu */}
          <div className="relative pl-1 border-l border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center font-bold text-xs">
                AS
              </div>
              <div className="hidden sm:block">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {t.doctorName}
                </span>
                <span className="block text-3xs text-slate-500 leading-tight">
                  {t.doctorSpecialty}
                </span>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="block text-xs font-bold text-slate-900">{t.doctorName}</span>
                  <span className="block text-2xs text-slate-500">Reg: MMC-2018/04/1042</span>
                  <span className="block text-3xs text-blue-700 mt-1 font-medium">{t.doctorFacility}</span>
                </div>

                {/* Availability Toggle */}
                <div className="p-2 border-b border-slate-100 text-xs">
                  <span className="text-3xs font-semibold text-slate-400 uppercase block mb-1.5">Availability</span>
                  <div className="grid grid-cols-3 gap-1 text-3xs font-medium text-center">
                    <button
                      type="button"
                      onClick={() => setAvailability('available')}
                      className={`py-1 rounded border ${
                        availability === 'available' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvailability('busy')}
                      className={`py-1 rounded border ${
                        availability === 'busy' ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      In Consult
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvailability('rounds')}
                      className={`py-1 rounded border ${
                        availability === 'rounds' ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      Ward Round
                    </button>
                  </div>
                </div>

                <div className="py-1 text-xs text-slate-700">
                  <Link
                    to="/doctor/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-2 px-3 py-1.5 hover:bg-slate-50 rounded"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Station Settings</span>
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-2 px-3 py-1.5 hover:bg-slate-50 rounded text-red-600"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Switch Role / Logout</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
