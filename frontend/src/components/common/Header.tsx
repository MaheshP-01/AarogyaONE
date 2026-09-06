import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, HeartPulse } from 'lucide-react';
import { APP_NAME, SUPPORTED_LANGUAGES } from '../../utils/constants';
import { useLanguage } from '../../hooks/useLanguage';

export const Header: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition-colors">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">{APP_NAME}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">AI-Assisted Rural Healthcare Platform</p>
            </div>
          </Link>

          {/* Role Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Overview
            </Link>
            <Link
              to="/health-worker"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/health-worker'
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Health Worker
            </Link>
            <Link
              to="/doctor"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/doctor'
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Doctor
            </Link>
            <Link
              to="/patient"
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/patient'
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Patient
            </Link>
          </nav>

          {/* Language Selector & Connectivity Badge */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Online</span>
            </div>

            <div className="flex items-center space-x-1 border border-slate-200 rounded-lg p-1 bg-slate-50 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-2 py-1 rounded font-medium transition-all ${
                    currentLanguage === lang.code
                      ? 'bg-white text-teal-800 shadow-xs border border-slate-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={`${lang.label} (${lang.nativeName})`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
