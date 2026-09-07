import { LanguageOption, RoleCardItem } from '../types';

export const APP_NAME = 'ArogyaOne';
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
    title: 'Patient Portal',
    roleName: 'Citizen / Beneficiary',
    subtitle: 'Patient Registration & Health Record',
    description:
      'Register for a unique digital health ID, create longitudinal health records, and access care across rural PHCs and hospitals in Maharashtra.',
    path: '/patients/register',
    features: [
      'Digital Patient Registration',
      'Unique Health ID (RC-2026)',
      'Multilingual Records (MR/HI/EN)',
      'Offline-Ready Health Records'
    ]
  }
];
