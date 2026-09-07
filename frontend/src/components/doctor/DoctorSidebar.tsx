import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ListOrdered,
  Video,
  Share2,
  Clock,
  Settings,
  HelpCircle,
  Home,
} from 'lucide-react';
import { TranslationDictionary } from '../../utils/translations';

interface DoctorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  urgentCount?: number;
  t: TranslationDictionary;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  isOpen,
  onClose,
  urgentCount = 3,
  t,
}) => {
  const location = useLocation();

  const navItems = [
    {
      id: 'overview',
      label: t.navOverview,
      to: '/doctor',
      icon: LayoutDashboard,
      active: location.pathname === '/doctor',
    },
    {
      id: 'queue',
      label: t.navDoctorQueue,
      to: '/doctor/queue',
      icon: ListOrdered,
      active: location.pathname === '/doctor/queue' || location.pathname.startsWith('/doctor/consultation'),
      badge: urgentCount > 0 ? `${urgentCount} Urgent` : undefined,
      badgeColor: 'bg-red-600 text-white',
    },
    {
      id: 'patients',
      label: t.navDoctorPatients,
      to: '/doctor/patients',
      icon: Users,
      active: location.pathname.startsWith('/doctor/patients'),
    },
    {
      id: 'teleconsult',
      label: t.navDoctorTeleconsult,
      to: '/doctor/teleconsultation',
      icon: Video,
      active: location.pathname.startsWith('/doctor/teleconsultation'),
    },
    {
      id: 'referrals',
      label: t.navDoctorReferrals,
      to: '/doctor/referrals',
      icon: Share2,
      active: location.pathname.startsWith('/doctor/referrals'),
    },
    {
      id: 'followups',
      label: t.navDoctorFollowUps,
      to: '/doctor/follow-ups',
      icon: Clock,
      active: location.pathname.startsWith('/doctor/follow-ups'),
    },
    {
      id: 'settings',
      label: t.navDoctorSettings,
      to: '/doctor/settings',
      icon: Settings,
      active: location.pathname === '/doctor/settings',
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
            Clinical Workstation
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    item.active
                      ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        item.active ? 'text-blue-700 stroke-[2.2]' : 'text-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 text-3xs font-bold uppercase rounded ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility / Help & Role Switcher */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <div className="flex items-center space-x-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer rounded">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>District Clinical Helpline</span>
          </div>

          <NavLink
            to="/"
            className="flex items-center space-x-2 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Portal Home</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};
