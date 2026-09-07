import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Activity,
  Share2,
  Clock,
  Home,
  ExternalLink,
} from 'lucide-react';
import { TranslationDictionary } from '../../utils/translations';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDictionary;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose, t }) => {
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      to: '/health-worker',
      icon: LayoutDashboard,
      active: location.pathname === '/health-worker',
    },
    {
      id: 'appointments',
      label: t.navAppointments,
      to: '/appointments',
      icon: Calendar,
      disabled: true,
      hint: 'Coming soon',
    },
    {
      id: 'triage',
      label: t.navTriage,
      to: '/triage',
      icon: Activity,
      disabled: true,
      hint: 'Coming soon',
    },
    {
      id: 'referrals',
      label: t.navReferrals,
      to: '/referrals',
      icon: Share2,
      disabled: true,
      hint: 'Coming soon',
    },
    {
      id: 'followups',
      label: t.navFollowUps,
      to: '/follow-ups',
      icon: Clock,
      disabled: true,
      hint: 'Coming soon',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-20 bg-slate-900/30 md:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-25 w-56 lg:w-60 bg-white border-r border-slate-200 flex flex-col justify-between pt-16 md:pt-0 transform transition-transform duration-200 ease-in-out md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-3">
          {/* Section title */}
          <div className="px-3 py-2 text-2xs font-bold text-slate-400 uppercase tracking-wider">
            Health Worker Station
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              if (!item.disabled) {
                return (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      item.active
                        ? 'bg-teal-50 border border-teal-200 text-teal-900 font-semibold shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          item.active ? 'text-teal-700 stroke-[2.2]' : 'text-slate-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                );
              }

              return (
                <div
                  key={item.id}
                  title={item.hint}
                  className="flex items-center justify-between px-3 py-2 rounded-md text-slate-400 text-xs font-medium cursor-not-allowed select-none hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-3xs text-slate-400 font-normal">
                    {item.hint}
                  </span>
                </div>
              );
            })}
          </nav>

          {/* Quick External Link to Separate Patient Registration */}
          <div className="mt-4 pt-3 border-t border-slate-100 px-1">
            <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Public Portal
            </span>
            <Link
              to="/patients/register"
              className="flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-600 hover:text-teal-800 hover:bg-teal-50/70 rounded-md border border-slate-200 transition-colors"
            >
              <span>Patient Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Bottom utility / Home link */}
        <div className="p-3 border-t border-slate-100">
          <NavLink
            to="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Portal Home</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
