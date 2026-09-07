import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  Share2,
  Clock,
  Home,
} from 'lucide-react';
import { TranslationDictionary } from '../../utils/translations';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDictionary;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose, t }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      to: '/health-worker',
      icon: LayoutDashboard,
      disabled: true,
      hint: 'Coming soon',
    },
    {
      id: 'patients',
      label: t.navPatients,
      to: '/patients/register',
      icon: Users,
      badge: t.newBadge,
      active: true,
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
            Clinical Workflow
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              if (item.active) {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-3 py-2 rounded-md bg-teal-50 border border-teal-200 text-teal-900 font-semibold text-xs transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 text-teal-700 stroke-[2.2]" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-3xs font-bold uppercase rounded bg-teal-700 text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
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
