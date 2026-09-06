import { LanguageOption, RoleCardItem } from '../types';

export const APP_NAME = 'RuralCare Connect';
export const APP_TAGLINE = 'AI-Assisted Rural Healthcare Platform';
export const APP_DESCRIPTION =
  'Connecting rural patients, frontline health workers and doctors for timely, continuous and accessible healthcare.';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
];

export const ROLE_CARDS: RoleCardItem[] = [
  {
    id: 'health-worker',
    title: 'Health Worker',
    roleName: 'ASHA / ANM / CHC',
    subtitle: 'Frontline Field Portal',
    description:
      'Register patients, capture vital observations, prepare structured chief complaints, and trigger digital triage assistance in rural sub-centers.',
    path: '/health-worker',
    features: [
      'Offline Patient Registration',
      'AI Decision Support & Triage',
      'Vitals & Symptom Capture',
      'PHC Referral Generation'
    ]
  },
  {
    id: 'doctor',
    title: 'Doctor',
    roleName: 'MO / Specialist / Consultant',
    subtitle: 'Clinical Review & Teleconsultation',
    description:
      'Review prioritized patient queues, examine AI-summarized clinical records, conduct teleconsultations, and issue digital prescriptions and referrals.',
    path: '/doctor',
    features: [
      'Prioritized Triage Queue',
      'Teleconsultation Workspace',
      'Prescription & Care Plan',
      'Emergency Escalation'
    ]
  },
  {
    id: 'patient',
    title: 'Patient',
    roleName: 'Citizen / Family Member',
    subtitle: 'Self-Care & Health Record',
    description:
      'Access your longitudinal health records, review prescribed follow-ups, and receive multilingual consultation summaries in Marathi or Hindi.',
    path: '/patient',
    features: [
      'Digital Health Card (ABHA-ready)',
      'Multilingual Summary View',
      'Follow-up & Prescription Log',
      'Offline Accessible Card'
    ]
  }
];
