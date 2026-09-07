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
  ArrowRight,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import { doctorMockService } from '../../services/doctorMockService';
import { ClinicalPatient, ConsultationQueueItem, ClinicalTimelineEvent } from '../../types/doctor';
import { VitalsPanel } from '../../components/doctor/VitalsPanel';
import { AITriagePanel } from '../../components/doctor/AITriagePanel';

export const TeleconsultationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<ClinicalPatient | undefined>(undefined);
  const [queueItem, setQueueItem] = useState<ConsultationQueueItem | undefined>(undefined);
  const [timeline, setTimeline] = useState<ClinicalTimelineEvent[]>([]);

  // Call states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(182);
  const [networkQuality] = useState<'4G (Stable)' | '3G (Audio Priority)' | '2G (Low-Bandwidth)'>('4G (Stable)');
  const [inCallNotes, setInCallNotes] = useState(
    'Patient visibly tachypneic. Speaking in short sentences. ASHA worker Sunita Shinde holding phone at bedside.'
  );
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const targetId = id || 'RC-2026-004821';
    const item = doctorMockService.getQueueItem(targetId);
    if (item) {
      setQueueItem(item);
      setPatient(doctorMockService.getPatient(item.patientId));
      setTimeline(doctorMockService.getPatientTimeline(item.patientId));
    } else {
      const pat = doctorMockService.getPatient(targetId);
      if (pat) {
        setPatient(pat);
        setQueueItem(doctorMockService.getQueue('all').find((q) => q.patientId === pat.id));
        setTimeline(doctorMockService.getPatientTimeline(pat.id));
      } else {
        const defaultPat = doctorMockService.getPatient('RC-2026-004821');
        setPatient(defaultPat);
        setQueueItem(doctorMockService.getQueueItem('RC-2026-004821'));
        setTimeline(doctorMockService.getPatientTimeline('RC-2026-004821'));
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

  const hasAllergies = patient?.allergies && !patient.allergies.includes('None reported');

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16">
      {/* Top Teleconsultation Header Strip */}
      <div className="bg-slate-900 text-white rounded-md px-4 sm:px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-white">
              Teleconsultation
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">
              {patient?.fullName} ({patient?.id})
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 hidden md:inline">
              ASHA Present: Sunita Shinde, ANM
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1 text-slate-300">
            <Signal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">{networkQuality}</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-bold">
            {formatTimer(callDuration)}
          </div>
        </div>
      </div>

      {/* Grid: Large Video Area (Left 8 cols) + Right Clinical Context Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT: VIDEO STAGE (8 cols) ================= */}
        <div className="lg:col-span-8 space-y-3">
          {/* Main Remote Video Window */}
          <div className="relative aspect-16/10 bg-slate-950 rounded-md overflow-hidden border border-slate-800 shadow-md flex items-center justify-center text-center">
            {isReconnecting ? (
              <div className="flex flex-col items-center space-y-2 text-slate-400 p-6">
                <RotateCw className="w-8 h-8 animate-spin text-slate-500" />
                <span className="text-xs font-medium">Re-establishing encrypted WebRTC channel...</span>
                <span className="text-[11px] text-slate-500">Auto-negotiating low-bandwidth Opus audio link</span>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-slate-950">
                <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xl mb-3">
                  {patient?.fullName.slice(0, 2).toUpperCase() || 'PT'}
                </div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  {patient?.fullName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Remote Rural Video Stream • Virdi Sub-Center
                </p>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800/80 text-emerald-300 border border-slate-700 rounded text-[11px] font-mono mt-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Encrypted Peer Connection Active</span>
                </div>
              </div>
            )}

            {/* Doctor Self-View PiP */}
            <div className="absolute top-3 right-3 w-36 aspect-4/3 bg-slate-800 border border-slate-700 rounded overflow-hidden shadow-lg flex flex-col items-center justify-center text-center">
              {isVideoOff ? (
                <div className="text-slate-400 text-[10px] flex flex-col items-center">
                  <VideoOff className="w-4 h-4 mb-1" />
                  <span>Camera Muted</span>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-300">
                  <div className="w-7 h-7 rounded bg-slate-700 flex items-center justify-center text-xs font-bold mb-0.5">
                    Dr
                  </div>
                  <span className="text-[10px] font-medium">Dr. Anjali Sharma</span>
                  <span className="text-[9px] text-slate-400">Doctor (You)</span>
                </div>
              )}
            </div>

            {/* In-Video Overlay Stats */}
            <div className="absolute bottom-3 left-3 flex items-center space-x-2 text-[11px] text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700">
              <span className="font-semibold text-white">{patient?.fullName}</span>
              <span>•</span>
              <span>SpO2: <strong className="text-amber-400">{queueItem?.vitals.spo2 || '91%'}</strong></span>
              <span>•</span>
              <span>HR: <strong className="text-slate-200">{queueItem?.vitals.heartRate || '96 bpm'}</strong></span>
            </div>
          </div>

          {/* Bottom Video Controls: Minimal & Professional */}
          <div className="bg-white border border-slate-200 rounded-md p-3 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Mic Toggle */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded transition-colors ${
                  isMuted
                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Camera Toggle */}
              <button
                type="button"
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-2 rounded transition-colors ${
                  isVideoOff
                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={isVideoOff ? 'Turn On Camera' : 'Turn Off Camera'}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>

              {/* Screen Share */}
              <button
                type="button"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-2 rounded transition-colors ${
                  isScreenSharing
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Share Screen / Lab Image"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Simulate network reconnect */}
              <button
                type="button"
                onClick={() => {
                  setIsReconnecting(true);
                  setTimeout(() => setIsReconnecting(false), 2000);
                }}
                className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
                title="Simulate network reconnections"
              >
                Simulate Reconnect
              </button>
            </div>

            {/* End Call & Switch to Clinical Workspace */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleEndCall}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold transition-colors"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Call</span>
              </button>

              <Link
                to={`/doctor/consultation/${patient?.id || 'RC-2026-004821'}`}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50 transition-colors inline-flex items-center space-x-1"
              >
                <span>Full Chart</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Live In-call Clinical Observations */}
          <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live In-Call Doctor Notes
              </label>
              <span className="text-[10px] text-slate-400">Syncs to consultation record</span>
            </div>
            <textarea
              rows={2}
              value={inCallNotes}
              onChange={(e) => setInCallNotes(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:bg-white focus:outline-none focus:border-slate-500"
            />
          </div>
        </div>

        {/* ================= RIGHT: CLINICAL CONTEXT PANEL (4 cols) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Patient Overview */}
          {patient && (
            <div className="bg-white border border-slate-200 rounded-md p-3.5 text-xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="font-bold text-slate-900">{patient.fullName}</span>
                <span className="font-mono text-slate-500 text-[11px]">{patient.id}</span>
              </div>
              <div className="text-slate-600 text-[11px]">
                {patient.age}y, {patient.gender} • Village: <span className="font-medium text-slate-800">{patient.village}</span>
              </div>
              {hasAllergies && (
                <div className="p-1.5 bg-red-50 border border-red-200 rounded text-red-900 text-[11px]">
                  <strong>Allergies:</strong> {patient.allergies.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Symptoms */}
          {queueItem && (
            <div className="bg-white border border-slate-200 rounded-md p-3.5 text-xs space-y-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Symptoms & Duration
              </span>
              <p className="font-medium text-slate-900">
                {queueItem.chiefComplaint}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {queueItem.symptomsList.map((s, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Vitals */}
          {queueItem && (
            <VitalsPanel vitals={queueItem.vitals} />
          )}

          {/* AI Summary */}
          {queueItem && (
            <AITriagePanel triage={queueItem.triage} />
          )}

          {/* Medical History snippet */}
          <div className="bg-white border border-slate-200 rounded-md p-3.5 text-xs space-y-2">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block pb-1 border-b border-slate-100">
              Recent History
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {timeline.slice(0, 2).map((evt) => (
                <div key={evt.id} className="text-[11px] border-l-2 border-slate-300 pl-2 py-0.5">
                  <div className="flex justify-between text-slate-400 font-mono text-[10px]">
                    <span>{evt.date}</span>
                    <span>{evt.type}</span>
                  </div>
                  <div className="font-medium text-slate-800">{evt.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
