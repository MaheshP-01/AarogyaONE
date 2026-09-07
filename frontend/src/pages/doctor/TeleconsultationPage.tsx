import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Share2,
  Signal,
  FileText,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import { ClinicalPatient, ConsultationQueueItem } from '../../types/doctor';
import { VitalsPanel } from '../../components/doctor/VitalsPanel';
import { AITriagePanel } from '../../components/doctor/AITriagePanel';

export const TeleconsultationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find patient or fallback to Suresh Patil (default demo case)
  const [patient, setPatient] = useState<ClinicalPatient | undefined>(undefined);
  const [queueItem, setQueueItem] = useState<ConsultationQueueItem | undefined>(undefined);

  // Call states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(182); // starting at ~3 mins
  const [networkQuality] = useState<'Good (4G)' | 'Fair (3G Audio-First)' | 'Weak (2G)'>('Good (4G)');
  const [inCallNotes, setInCallNotes] = useState(
    'Patient visibly tachypneic. Speaking in short sentences. ASHA worker Sunita Shinde holding phone at bedside.'
  );

  useEffect(() => {
    const targetId = id || 'RC-2026-004821';
    const item = doctorMockService.getQueueItem(targetId);
    if (item) {
      setQueueItem(item);
      setPatient(doctorMockService.getPatient(item.patientId));
    } else {
      const pat = doctorMockService.getPatient(targetId);
      if (pat) {
        setPatient(pat);
        setQueueItem(doctorMockService.getQueue('all').find((q) => q.patientId === pat.id));
      } else {
        // Fallback default
        const defaultPat = doctorMockService.getPatient('RC-2026-004821');
        setPatient(defaultPat);
        setQueueItem(doctorMockService.getQueueItem('RC-2026-004821'));
      }
    }
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (patient) {
      navigate(`/doctor/consultation/${patient.id}`);
    } else {
      navigate('/doctor');
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Top Teleconsultation Strip */}
      <div className="bg-slate-900 text-white rounded-lg px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Live Teleconsultation
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-300 font-medium">
                {patient ? `${patient.fullName} (${patient.id})` : 'Connecting...'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
              <span>Remote Site: {patient?.village || 'Rural Subcenter'}, Shirpur</span>
              <span>•</span>
              <span>ASHA in Attendance: Sunita Shinde, ANM</span>
            </div>
          </div>
        </div>

        {/* Network & Duration stats */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-emerald-400 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
            <Signal className="w-3.5 h-3.5" />
            <span className="text-[11px]">{networkQuality}</span>
          </div>
          <div className="text-slate-200 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 font-bold">
            {formatTimer(callDuration)}
          </div>
        </div>
      </div>

      {/* WebRTC Architecture Notice */}
      <div className="bg-blue-50 border border-blue-200 text-blue-900 text-xs px-4 py-2 rounded-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>WebRTC Clinical Video Architecture:</strong> P2P signaling active via encrypted WebSocket channel. Audio-first adaptive fallback enabled for low-connectivity 2G/3G rural networks.
          </span>
        </div>
        <span className="text-[10px] text-blue-700 font-mono bg-blue-100 px-2 py-0.5 rounded">
          Opus 16kbps / VP8 360p
        </span>
      </div>

      {/* Main Grid: Video Stream (Left/Center 8 cols) + Clinical Context (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT: VIDEO STAGE (8 cols) ================= */}
        <div className="lg:col-span-8 space-y-3">
          {/* Main Remote Video Window */}
          <div className="relative aspect-16/10 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-lg flex items-center justify-center text-center">
            {/* Simulated Remote Patient Stream */}
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 font-bold text-2xl shadow-inner mb-3">
                {patient?.fullName.slice(0, 2).toUpperCase() || 'PT'}
              </div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {patient?.fullName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ASHA Worker: Sunita Shinde (Present in Room)
              </p>
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-900/40 text-emerald-300 border border-emerald-800/60 rounded text-[11px] font-mono mt-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Remote Camera Active • Virdi Health Sub-Center</span>
              </div>
            </div>

            {/* Doctor Self-View PiP */}
            <div className="absolute top-4 right-4 w-36 sm:w-44 aspect-4/3 bg-slate-800 border-2 border-slate-700 rounded-md overflow-hidden shadow-xl flex flex-col items-center justify-center text-center">
              {isVideoOff ? (
                <div className="text-slate-400 text-[10px] flex flex-col items-center">
                  <VideoOff className="w-4 h-4 mb-1" />
                  <span>Camera Muted</span>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-700/80 flex flex-col items-center justify-center text-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold mb-1">
                    Dr
                  </div>
                  <span className="text-[10px] font-medium text-slate-300">Dr. Anjali Sharma</span>
                  <span className="text-[9px] text-slate-400">You (Doctor)</span>
                </div>
              )}
            </div>

            {/* In-Video Overlay Stats */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-[11px] text-slate-300 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded border border-slate-700">
              <span className="font-semibold text-white">{patient?.fullName}</span>
              <span>•</span>
              <span>SpO2: <strong className="text-amber-400">{queueItem?.vitals.spo2 || '91%'}</strong></span>
              <span>•</span>
              <span>HR: <strong className="text-slate-200">{queueItem?.vitals.heartRate || '96 bpm'}</strong></span>
            </div>
          </div>

          {/* Bottom Call Control Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 sm:px-6 shadow-2xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Mic Toggle */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${
                  isMuted
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Video Toggle */}
              <button
                type="button"
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3 rounded-full transition-colors ${
                  isVideoOff
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={isVideoOff ? 'Turn On Camera' : 'Turn Off Camera'}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              {/* Screen Share */}
              <button
                type="button"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-full transition-colors ${
                  isScreenSharing
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Share Screen / Diagnostic Lab Image"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* End Call / Return to Consultation */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleEndCall}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-md text-xs font-bold shadow-xs transition-colors"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Teleconsult</span>
              </button>

              <Link
                to={`/doctor/consultation/${patient?.id || 'RC-2026-004821'}`}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-blue-800 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
              >
                <span>Open Full Clinical Chart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick In-Call Physician Notes */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-blue-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Teleconsultation Physician Notes
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Syncs to consultation record</span>
            </div>
            <textarea
              rows={3}
              value={inCallNotes}
              onChange={(e) => setInCallNotes(e.target.value)}
              placeholder="Record quick real-time observations during the call..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* ================= RIGHT: CLINICAL DATA CONTEXT (4 cols) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Demographics */}
          {patient && (
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">{patient.fullName}</span>
                <span className="font-mono text-slate-500">{patient.id}</span>
              </div>
              <div className="text-slate-600">
                {patient.age}y / {patient.gender} • Village: <span className="font-medium text-slate-800">{patient.village}, {patient.taluka}</span>
              </div>
              {patient.allergies && !patient.allergies.includes('None reported') && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-red-900 text-[11px]">
                  <strong>Allergies:</strong> {patient.allergies.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Intake Vitals */}
          {queueItem && (
            <VitalsPanel vitals={queueItem.vitals} />
          )}

          {/* AI-Assisted Triage Panel */}
          {queueItem && (
            <AITriagePanel triage={queueItem.triage} />
          )}
        </div>
      </div>
    </div>
  );
};
