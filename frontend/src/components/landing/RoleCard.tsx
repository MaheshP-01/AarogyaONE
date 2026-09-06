import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RoleCardItem } from '../../types';

interface RoleCardProps {
  card: RoleCardItem;
}

export const RoleCard: React.FC<RoleCardProps> = ({ card }) => {
  const getIcon = () => {
    switch (card.id) {
      case 'health-worker':
        return <Users className="w-6 h-6 text-teal-600" />;
      case 'doctor':
        return <Stethoscope className="w-6 h-6 text-blue-600" />;
      case 'patient':
        return <User className="w-6 h-6 text-emerald-600" />;
    }
  };

  const getBadgeColor = () => {
    switch (card.id) {
      case 'health-worker':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'doctor':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'patient':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getButtonColor = () => {
    switch (card.id) {
      case 'health-worker':
        return 'bg-teal-600 hover:bg-teal-700 text-white';
      case 'doctor':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'patient':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
            {getIcon()}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeColor()}`}>
            {card.roleName}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">{card.title}</h3>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">{card.subtitle}</p>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {card.description}
        </p>

        <div className="border-t border-slate-100 pt-4 mb-6">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Key Modules</p>
          <ul className="space-y-2 text-xs text-slate-600">
            {card.features.map((feature, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        to={card.path}
        className={`w-full py-2.5 px-4 rounded-xl text-center text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${getButtonColor()}`}
      >
        <span>Open {card.title} Portal</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
