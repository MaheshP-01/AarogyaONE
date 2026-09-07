import React from 'react';
import { Link } from 'react-router-dom';
import { X, Bell, AlertTriangle, CheckCircle2, Calendar, FileText, ArrowRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ClinicalNotification {
  id: string;
  type: 'urgent' | 'referral' | 'followup' | 'lab';
  title: string;
  patientName: string;
  patientId: string;
  timestamp: string;
  detail: string;
  read: boolean;
}

const NOTIFICATIONS: ClinicalNotification[] = [
  {
    id: 'notif-1',
    type: 'urgent',
    title: 'New urgent case assigned',
    patientName: 'Suresh Patil',
    patientId: 'RC-2026-004821',
    timestamp: '18 min ago',
    detail: 'Acute breathing difficulty with SpO2 91% reported by ANM at Virdi PHC.',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'referral',
    title: 'Referral RC-REF-1048 accepted',
    patientName: 'Kavita Gawit',
    patientId: 'RC-2026-003290',
    timestamp: '45 min ago',
    detail: 'Civil Hospital Nandurbar allocated Maternity High-Risk bed.',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'followup',
    title: 'Follow-up scheduled for today',
    patientName: 'Namdeo Sonawane',
    patientId: 'RC-2026-002115',
    timestamp: '2 hours ago',
    detail: 'Diabetic peripheral neuropathy evaluation due at 10:30 AM.',
    read: true,
  },
  {
    id: 'notif-4',
    type: 'lab',
    title: 'Digital lab report uploaded',
    patientName: 'Mangala Bai Patil',
    patientId: 'RC-2026-005118',
    timestamp: '4 hours ago',
    detail: 'Serum Uric Acid & CBC results transmitted by Shirpur Rural Hospital lab.',
    read: true,
  },
];

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden drawer-backdrop">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col drawer-panel animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Clinical Alerts & Updates
              </h2>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                2 unread
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {NOTIFICATIONS.map((item) => {
              let Icon = Bell;
              let iconColor = 'text-slate-500 bg-slate-100';

              if (item.type === 'urgent') {
                Icon = AlertTriangle;
                iconColor = 'text-red-700 bg-red-50 border border-red-200';
              } else if (item.type === 'referral') {
                Icon = CheckCircle2;
                iconColor = 'text-blue-700 bg-blue-50 border border-blue-200';
              } else if (item.type === 'followup') {
                Icon = Calendar;
                iconColor = 'text-emerald-700 bg-emerald-50 border border-emerald-200';
              } else if (item.type === 'lab') {
                Icon = FileText;
                iconColor = 'text-purple-700 bg-purple-50 border border-purple-200';
              }

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-md transition-colors text-xs space-y-1.5 ${
                    !item.read ? 'bg-slate-50/80 hover:bg-slate-100/80' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${iconColor}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="font-semibold text-slate-900">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] pl-7">
                    {item.detail}
                  </p>

                  <div className="flex items-center justify-between pt-1 pl-7 text-[11px]">
                    <span className="text-slate-500 font-medium">
                      Patient: {item.patientName} (<span className="font-mono text-[10px]">{item.patientId}</span>)
                    </span>
                    <Link
                      to={`/doctor/patients/${item.patientId}`}
                      onClick={onClose}
                      className="inline-flex items-center space-x-0.5 text-blue-700 hover:text-blue-900 font-medium"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
