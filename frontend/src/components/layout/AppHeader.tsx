import React from 'react';
import { Menu, X } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TranslationDictionary } from '../../utils/translations';

interface AppHeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isOnline: boolean;
  onToggleOnline?: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  t: TranslationDictionary;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  isOnline,
  onToggleOnline,
  isSidebarOpen,
  onToggleSidebar,
  t,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile menu toggle + Branding */}
        <div className="flex items-center space-x-3">
          {/* Mobile sidebar button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Platform Subtitle */}
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                {t.appTitle}
              </h1>
            </div>
            <p className="text-2xs text-slate-500 font-medium tracking-wide">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Network Status + Language Selector + Health Worker Profile */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Network Indicator (Offline-ready architectural state) */}
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
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="hidden sm:inline">
              {isOnline ? t.onlineStatus : t.offlineStatus}
            </span>
            <span className="sm:hidden">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </button>

          {/* Language Selector: English / मराठी / हिंदी */}
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium text-slate-700">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
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
              onClick={() => onLanguageChange('mr')}
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
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                currentLanguage === 'hi'
                  ? 'bg-white text-teal-800 font-bold shadow-2xs'
                  : 'hover:text-slate-900 text-slate-600'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Health Worker Profile */}
          <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-xs">
              SS
            </div>
            <div className="text-left">
              <span className="block text-xs font-semibold text-slate-900 leading-tight">
                {t.healthWorkerRole}
              </span>
              <span className="block text-2xs text-slate-500 leading-tight">
                {t.phcName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
