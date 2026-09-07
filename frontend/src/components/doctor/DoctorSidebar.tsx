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
  Stethoscope,
} from 'lucide-react';

interface DoctorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  urgentCount?: number;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  isOpen,
  onClose,
  urgentCount = 3,
}) => {
  const location = useLocation();

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      to: '/doctor',
      icon: LayoutDashboard,
      active: location.pathname === '/doctor',
    },
    {
      id: 'patients',
      label: 'Patients',
      to: '/doctor/patients',
      icon: Users,
      active: location.pathname.startsWith('/doctor/patients'),
    },
    {
      id: 'queue',
      label: 'Consultation Queue',
      to: '/doctor/queue',
      icon: ListOrdered,
      active: location.pathname === '/doctor/queue' || location.pathname.startsWith('/doctor/consultation'),
      badge: urgentCount > 0 ? `${urgentCount}` : undefined,
    },
    {
      id: 'teleconsult',
      label: 'Teleconsultations',
      to: '/doctor/teleconsultation',
      icon: Video,
      active: location.pathname.startsWith('/doctor/teleconsultation'),
    },
    {
      id: 'referrals',
      label: 'Referrals',
      to: '/doctor/referrals',
      icon: Share2,
      active: location.pathname.startsWith('/doctor/referrals'),
    },
    {
      id: 'followups',
      label: 'Follow-ups',
      to: '/doctor/follow-ups',
      icon: Clock,
      active: location.pathname.startsWith('/doctor/follow-ups'),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 md:hidden backdrop-blur-2xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: 220-240px wide */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-56 bg-white border-r border-slate-200 flex flex-col justify-between h-screen transition-transform duration-200 ease-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Top Brand & Public Healthcare Mark */}
          <div className="h-13 px-4 flex items-center border-b border-slate-100">
            <NavLink to="/doctor" className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-semibold text-xs shrink-0">
                AO
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 tracking-tight leading-none">
                  ArogyaOne
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5 leading-none">
                  Public Health Platform
                </span>
              </div>
            </NavLink>
          </div>

          {/* Primary Navigation List */}
          <div className="p-3 space-y-0.5">
            <div className="px-2 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Clinical Workstation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  onClick={onClose}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                    item.active
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-slate-900' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Divider */}
          <div className="px-3 py-2">
            <div className="border-t border-slate-100" />
          </div>

          {/* Secondary / Preference Links */}
          <div className="p-3 pt-0 space-y-0.5">
            <NavLink
              to="/doctor/settings"
              onClick={onClose}
              className={`flex items-center space-x-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                location.pathname === '/doctor/settings'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Settings</span>
            </NavLink>

            <a
              href="#help"
              onClick={(e) => {
                e.preventDefault();
                alert('ArogyaOne Clinical Support Desk: Call 1800-233-0422 (Toll Free) or contact District Health Informatics Cell.');
              }}
              className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Help & Protocols</span>
            </a>
          </div>
        </div>

        {/* Bottom Doctor Profile Card with Online Indicator */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-7 h-7 rounded bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                AS
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 truncate">
                Dr. Anjali Sharma
              </div>
              <div className="text-[10px] text-slate-400 truncate flex items-center space-x-1">
                <span>General Physician</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
