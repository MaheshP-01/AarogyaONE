import React, { useEffect, useState } from 'react';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, ROLE_CARDS } from '../utils/constants';
import { RoleCard } from '../components/landing/RoleCard';
import { checkBackendHealth, checkAiHealth } from '../services/api';
import { Activity, Server, Cpu, CheckCircle } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [aiStatus, setAiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Check backend health
    checkBackendHealth()
      .then((res) => {
        if (res.status === 'ok') setBackendStatus('online');
        else setBackendStatus('offline');
      })
      .catch(() => setBackendStatus('offline'));

    // Check AI service health
    checkAiHealth()
      .then((res) => {
        if (res.status === 'ok') setAiStatus('online');
        else setAiStatus('offline');
      })
      .catch(() => setAiStatus('offline'));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-4">
          <Activity className="w-3.5 h-3.5 text-teal-600" />
          <span>Smart India Hackathon 2026 — MVP Foundation</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
          {APP_NAME}
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-teal-700 mb-5">
          {APP_TAGLINE}
        </p>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {APP_DESCRIPTION}
        </p>
      </section>

      {/* Role Selection Cards */}
      <section className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-slate-900">Select Platform Role</h2>
          <p className="text-xs text-slate-500 mt-1">Foundation portals configured for end-to-end rural triage workflow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROLE_CARDS.map((card) => (
            <RoleCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      {/* Architecture & Service Health Bar */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Server className="w-4 h-4 text-teal-600" />
              <span>System Scaffolding & Health Monitor</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status of decoupled foundation microservices (Step 1 Baseline)
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
            Node v24.13 • Python 3.13 • React 18
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {/* Frontend Node */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Frontend Client</span>
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                <span>Running</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800">React + Vite + Tailwind</p>
            <p className="text-xs text-slate-500 font-mono mt-1">Port 5173</p>
          </div>

          {/* Backend Node */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">REST API Backend</span>
              <span
                className={`inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  backendStatus === 'online'
                    ? 'text-emerald-700 bg-emerald-100'
                    : backendStatus === 'checking'
                    ? 'text-amber-700 bg-amber-100'
                    : 'text-slate-600 bg-slate-200'
                }`}
              >
                <Server className="w-3 h-3" />
                <span>{backendStatus === 'online' ? 'Online' : backendStatus === 'checking' ? 'Checking...' : 'Standby'}</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800">Node.js + Express + TS</p>
            <p className="text-xs text-slate-500 font-mono mt-1">GET /api/health</p>
          </div>

          {/* AI Service */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">AI Decision Engine</span>
              <span
                className={`inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  aiStatus === 'online'
                    ? 'text-emerald-700 bg-emerald-100'
                    : aiStatus === 'checking'
                    ? 'text-amber-700 bg-amber-100'
                    : 'text-slate-600 bg-slate-200'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>{aiStatus === 'online' ? 'Online' : aiStatus === 'checking' ? 'Checking...' : 'Standby'}</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800">Python + FastAPI</p>
            <p className="text-xs text-slate-500 font-mono mt-1">GET /health</p>
          </div>
        </div>
      </section>
    </div>
  );
};
