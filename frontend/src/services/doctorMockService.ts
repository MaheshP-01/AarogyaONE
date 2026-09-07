import {
  ClinicalPatient,
  ConsultationQueueItem,
  ClinicalTimelineEvent,
  ReferralRecord,
  FollowUpRecord,
  ConsultationRecord,
  DoctorKpiSummary,
} from '../types/doctor';
import { RegisteredPatientResult } from '../types/registration';

// Initial baseline mock clinical patients
const BASELINE_PATIENTS: ClinicalPatient[] = [
  {
    id: 'RC-2026-004821',
    fullName: 'Suresh Patil',
    age: 62,
    gender: 'Male',
    preferredLanguage: 'mr',
    village: 'Virdi',
    taluka: 'Shirpur',
    district: 'Dhule',
    phone: '9822014821',
    emergencyContact: {
      name: 'Pravin Patil',
      relation: 'Son',
      phone: '9822019944',
    },
    allergies: ['Penicillin', 'Dust sensitive'],
    existingConditions: ['Hypertension (BP)', 'Chronic Bronchitis'],
    currentMedications: ['Amlodipine 5mg once daily', 'Salbutamol Inhaler SOS'],
    abhaId: '91-4421-8890-1204',
    registeredDate: '2026-06-12',
  },
  {
    id: 'RC-2026-003290',
    fullName: 'Kavita Gawit',
    age: 28,
    gender: 'Female',
    preferredLanguage: 'mr',
    village: 'Khandbara',
    taluka: 'Navapur',
    district: 'Nandurbar',
    phone: '9850123290',
    emergencyContact: {
      name: 'Sunil Gawit',
      relation: 'Husband',
      phone: '9850129988',
    },
    allergies: ['None reported'],
    existingConditions: ['Antenatal 24 Weeks', 'Mild Anemia'],
    currentMedications: ['Iron & Folic Acid tabs', 'Calcium daily'],
    abhaId: '91-3290-7711-5401',
    registeredDate: '2026-05-18',
  },
  {
    id: 'RC-2026-002115',
    fullName: 'Namdeo Sonawane',
    age: 54,
    gender: 'Male',
    preferredLanguage: 'mr',
    village: 'Adavad',
    taluka: 'Chopda',
    district: 'Jalgaon',
    phone: '9423182115',
    emergencyContact: {
      name: 'Meena Sonawane',
      relation: 'Wife',
      phone: '9423180011',
    },
    allergies: ['Sulfa drugs'],
    existingConditions: ['Type 2 Diabetes', 'Hypertension'],
    currentMedications: ['Metformin 500mg twice daily', 'Telmisartan 40mg daily'],
    abhaId: '91-2115-6632-9012',
    registeredDate: '2026-04-02',
  },
  {
    id: 'RC-2026-001042',
    fullName: 'Aarav Bhil',
    age: 6,
    gender: 'Male',
    preferredLanguage: 'mr',
    village: 'Dahiwel',
    taluka: 'Sakri',
    district: 'Dhule',
    phone: '9765431042',
    emergencyContact: {
      name: 'Kisan Bhil',
      relation: 'Father',
      phone: '9765430099',
    },
    allergies: ['None reported'],
    existingConditions: ['None reported'],
    currentMedications: ['None reported'],
    abhaId: '91-1042-3344-7788',
    registeredDate: '2026-08-30',
  },
  {
    id: 'RC-2026-005118',
    fullName: 'Mangala Bai Patil',
    age: 58,
    gender: 'Female',
    preferredLanguage: 'hi',
    village: 'Thalner',
    taluka: 'Shirpur',
    district: 'Dhule',
    phone: '9881055118',
    emergencyContact: {
      name: 'Ramesh Patil',
      relation: 'Brother',
      phone: '9881050022',
    },
    allergies: ['None reported'],
    existingConditions: ['Osteoarthritis Knee', 'Mild Gastritis'],
    currentMedications: ['Paracetamol 650mg SOS', 'Pantoprazole 40mg'],
    abhaId: '91-5118-9901-4433',
    registeredDate: '2026-07-22',
  },
];

// Baseline Queue Items
const BASELINE_QUEUE: ConsultationQueueItem[] = [
  {
    id: 'CQ-101',
    tokenNumber: 'P-021',
    patientId: 'RC-2026-004821',
    patientName: 'Suresh Patil',
    age: 62,
    gender: 'Male',
    village: 'Virdi',
    taluka: 'Shirpur',
    district: 'Dhule',
    chiefComplaint: 'Acute breathing difficulty with high-grade fever since yesterday evening',
    symptomsDuration: '2 days',
    symptomsList: ['Severe shortness of breath', 'High fever (102°F)', 'Productive cough', 'Chest tightness'],
    riskLevel: 'HIGH',
    priority: 'URGENT',
    waitingTime: '18 min',
    status: 'waiting',
    assignedDoctor: 'Dr. Anjali Sharma',
    vitals: {
      temperature: '102.2°F',
      heartRate: '98 bpm',
      bloodPressure: '138/88 mmHg',
      spo2: '91%',
      respiratoryRate: '24 /min',
      recordedAt: '18 mins ago',
      recordedBy: 'Sunita Shinde, ANM',
    },
    triage: {
      riskLevel: 'HIGH',
      priority: 'URGENT',
      reportedIndicators: ['High fever (>102°F)', 'Hypoxia (SpO2 91% on room air)', 'Tachypnea (RR 24/min)', 'Chronic bronchitis comorbidity'],
      aiSummary: 'Reported symptoms and vitals indicate elevated risk of acute lower respiratory infection with mild hypoxia. Prompt clinical evaluation recommended.',
      recommendedNextStep: 'Prioritize physician assessment. Evaluate for oxygen support and chest auscultation.',
      potentialMissingInfo: 'Duration of fever spikes not fully specified.',
      disclaimer: 'Decision-support information generated from reported symptoms and available vitals. Not a diagnosis. Final clinical assessment rests with attending physician.',
    },
  },
  {
    id: 'CQ-102',
    tokenNumber: 'P-022',
    patientId: 'RC-2026-001042',
    patientName: 'Aarav Bhil',
    age: 6,
    gender: 'Male',
    village: 'Dahiwel',
    taluka: 'Sakri',
    district: 'Dhule',
    chiefComplaint: 'Multiple watery stools (6 episodes), vomiting, and marked lethargy',
    symptomsDuration: '1 day',
    symptomsList: ['Watery diarrhea', 'Vomiting', 'Dry mouth', 'Decreased urine output'],
    riskLevel: 'HIGH',
    priority: 'URGENT',
    waitingTime: '24 min',
    status: 'waiting',
    assignedDoctor: 'Dr. Anjali Sharma',
    vitals: {
      temperature: '99.4°F',
      heartRate: '122 bpm',
      bloodPressure: '88/56 mmHg',
      spo2: '97%',
      respiratoryRate: '26 /min',
      recordedAt: '24 mins ago',
      recordedBy: 'Kavita Padvi, ASHA',
    },
    triage: {
      riskLevel: 'HIGH',
      priority: 'URGENT',
      reportedIndicators: ['Tachycardia in child (HR 122)', 'Borderline low BP', 'Signs of moderate dehydration', 'Frequent watery diarrhea'],
      aiSummary: 'Clinical indicators suggest moderate dehydration secondary to acute gastroenteritis in pediatric patient. Immediate oral/IV rehydration assessment advised.',
      recommendedNextStep: 'Assess dehydration degree, administer ORS + Zinc, verify fluid intake.',
      potentialMissingInfo: 'Exact fluid volume consumed in past 6 hours.',
      disclaimer: 'Decision-support information generated from reported symptoms and available vitals. Not a diagnosis.',
    },
  },
  {
    id: 'CQ-103',
    tokenNumber: 'P-023',
    patientId: 'RC-2026-003290',
    patientName: 'Kavita Gawit',
    age: 28,
    gender: 'Female',
    village: 'Khandbara',
    taluka: 'Navapur',
    district: 'Nandurbar',
    chiefComplaint: 'Second trimester routine check-up, extreme fatigue and dizziness upon standing',
    symptomsDuration: '1 week',
    symptomsList: ['Fatigue', 'Postural dizziness', 'Pallor', 'Decreased appetite'],
    riskLevel: 'MODERATE',
    priority: 'PRIORITY',
    waitingTime: '35 min',
    status: 'waiting',
    assignedDoctor: 'Dr. Anjali Sharma',
    vitals: {
      temperature: '98.6°F',
      heartRate: '84 bpm',
      bloodPressure: '106/68 mmHg',
      spo2: '98%',
      respiratoryRate: '18 /min',
      recordedAt: '35 mins ago',
      recordedBy: 'Rekha Naik, ANM',
    },
    triage: {
      riskLevel: 'MODERATE',
      priority: 'PRIORITY',
      reportedIndicators: ['Conjunctival pallor noted', 'Fatigue in 24w pregnancy', 'Normal vitals'],
      aiSummary: 'Symptoms consistent with gestational anemia. Recommend hemoglobin check and review of iron supplementation adherence.',
      recommendedNextStep: 'Verify Hb level, check fetal heart sounds, dietary counseling.',
      disclaimer: 'Decision-support information generated from reported symptoms and available vitals. Not a diagnosis.',
    },
  },
  {
    id: 'CQ-104',
    tokenNumber: 'P-024',
    patientId: 'RC-2026-002115',
    patientName: 'Namdeo Sonawane',
    age: 54,
    gender: 'Male',
    village: 'Adavad',
    taluka: 'Chopda',
    district: 'Jalgaon',
    chiefComplaint: 'Routine diabetes and blood pressure check, intermittent tingling in toes',
    symptomsDuration: '3 weeks',
    symptomsList: ['Bilateral foot tingling', 'Increased thirst', 'Occasional morning headache'],
    riskLevel: 'LOW',
    priority: 'ROUTINE',
    waitingTime: '42 min',
    status: 'waiting',
    assignedDoctor: 'Dr. Anjali Sharma',
    vitals: {
      temperature: '98.4°F',
      heartRate: '76 bpm',
      bloodPressure: '144/92 mmHg',
      spo2: '98%',
      respiratoryRate: '16 /min',
      recordedAt: '42 mins ago',
      recordedBy: 'Suman Chaudhari, ASHA',
    },
    triage: {
      riskLevel: 'LOW',
      priority: 'ROUTINE',
      reportedIndicators: ['Borderline high blood pressure (144/92)', 'Early diabetic peripheral neuropathy indicators'],
      aiSummary: 'Chronic disease management follow-up. Blood pressure elevated above target. Neuropathy evaluation advised.',
      recommendedNextStep: 'Review blood glucose log, check foot sensation with monofilament, adjust antihypertensive if indicated.',
      disclaimer: 'Decision-support information generated from reported symptoms and available vitals. Not a diagnosis.',
    },
  },
  {
    id: 'CQ-105',
    tokenNumber: 'P-025',
    patientId: 'RC-2026-005118',
    patientName: 'Mangala Bai Patil',
    age: 58,
    gender: 'Female',
    village: 'Thalner',
    taluka: 'Shirpur',
    district: 'Dhule',
    chiefComplaint: 'Bilateral knee pain worsening while squatting or working in fields',
    symptomsDuration: '2 months',
    symptomsList: ['Knee joint stiffness', 'Pain with weight bearing', 'Crepitus in right knee'],
    riskLevel: 'LOW',
    priority: 'ROUTINE',
    waitingTime: '55 min',
    status: 'waiting',
    assignedDoctor: 'Dr. Anjali Sharma',
    vitals: {
      temperature: '98.2°F',
      heartRate: '72 bpm',
      bloodPressure: '128/80 mmHg',
      spo2: '99%',
      respiratoryRate: '16 /min',
      recordedAt: '55 mins ago',
      recordedBy: 'Sunita Shinde, ANM',
    },
    triage: {
      riskLevel: 'LOW',
      priority: 'ROUTINE',
      reportedIndicators: ['Chronic osteoarthritis presentation', 'Normal vital signs'],
      aiSummary: 'Degenerative joint disease symptom pattern. Non-pharmacological measures, quadriceps exercises, and mild analgesics suggested.',
      recommendedNextStep: 'Clinical knee joint examination, prescribe physiotherapy exercises.',
      disclaimer: 'Decision-support information generated from reported symptoms and available vitals. Not a diagnosis.',
    },
  },
];

// Baseline Longitudinal Timelines
const BASELINE_TIMELINES: Record<string, ClinicalTimelineEvent[]> = {
  'RC-2026-004821': [
    {
      id: 'TL-101',
      date: '2026-08-12',
      type: 'Consultation',
      title: 'Viral URI & Productive Cough',
      facility: 'Shirpur Rural PHC',
      doctorOrWorker: 'Dr. Anjali Sharma',
      details: 'Patient presented with mild fever and wet cough. Prescribed Amoxicillin 500mg TDS for 5 days and Cetirizine.',
      badge: 'Resolved',
    },
    {
      id: 'TL-102',
      date: '2026-07-03',
      type: 'Visit',
      title: 'Sub-Center Field Visit & BP Check',
      facility: 'Virdi Sub-Center',
      doctorOrWorker: 'Sunita Shinde, ANM',
      details: 'Routine home visit for chronic hypertension. BP recorded at 134/84 mmHg. Medication compliance verified.',
    },
    {
      id: 'TL-103',
      date: '2026-06-20',
      type: 'Lab Report',
      title: 'Complete Blood Count & Blood Glucose',
      facility: 'Dhule District Hospital Lab',
      doctorOrWorker: 'Lab Diagnostics',
      details: 'Hemoglobin: 13.8 g/dL, Total Leucocyte Count: 7,800/mcL, Fasting Blood Sugar: 104 mg/dL. Normal limits.',
    },
    {
      id: 'TL-104',
      date: '2026-05-10',
      type: 'Prescription',
      title: 'Antihypertensive Refill',
      facility: 'Shirpur Taluka Hospital',
      doctorOrWorker: 'Dr. S. K. Mahajan',
      details: 'Tab. Amlodipine 5mg once daily for 60 days. Instructed on low-sodium dietary habits.',
    },
  ],
  'RC-2026-001042': [
    {
      id: 'TL-201',
      date: '2026-06-15',
      type: 'Visit',
      title: 'Routine Childhood Immunization',
      facility: 'Sakri PHC',
      doctorOrWorker: 'Kavita Padvi, ASHA',
      details: 'Vitamin A dose administered. Weight 19.5 kg (normal percentile). Growth chart updated.',
    },
  ],
  'RC-2026-003290': [
    {
      id: 'TL-301',
      date: '2026-07-14',
      type: 'Visit',
      title: 'First Trimester Antenatal Registration',
      facility: 'Navapur Sub-Center',
      doctorOrWorker: 'Rekha Naik, ANM',
      details: 'ANC-1 visit recorded. Tetanus Toxoid (TT-1) given. Weight 48 kg. Hemoglobin 10.1 g/dL.',
    },
  ],
  'RC-2026-002115': [
    {
      id: 'TL-401',
      date: '2026-06-08',
      type: 'Consultation',
      title: 'Quarterly Diabetic Evaluation',
      facility: 'Chopda Rural Hospital',
      doctorOrWorker: 'Dr. V. B. Pawar',
      details: 'HbA1c recorded at 8.2%. Metformin maintained at 500mg BD. Advised dietary modifications.',
    },
  ],
};

// Baseline Referrals
const BASELINE_REFERRALS: ReferralRecord[] = [
  {
    id: 'RC-REF-2026-1048',
    patientId: 'RC-2026-004821',
    patientName: 'Suresh Patil',
    patientAge: 62,
    patientGender: 'Male',
    priority: 'Urgent',
    requiredSpecialty: 'Pulmonology / Respiratory Medicine',
    destinationFacility: 'Government Medical College & District Hospital, Dhule',
    facilityType: 'District Hospital',
    destinationLocation: 'Dhule City (48 km from Shirpur)',
    reason: 'Exacerbation of chronic bronchitis with persistent hypoxia (SpO2 91%) and fever spikes.',
    clinicalNotes: 'Suspected secondary bacterial pneumonia in patient with chronic obstructive airway disease.',
    createdBy: 'Dr. Anjali Sharma',
    createdAt: '2026-09-06 14:30',
    status: 'Pending',
  },
  {
    id: 'RC-REF-2026-1042',
    patientId: 'RC-2026-003290',
    patientName: 'Kavita Gawit',
    patientAge: 28,
    patientGender: 'Female',
    priority: 'Routine',
    requiredSpecialty: 'Obstetrics & Gynecology (USG Anomaly Scan)',
    destinationFacility: 'Nandurbar Civil Hospital',
    facilityType: 'District Civil Hospital',
    destinationLocation: 'Nandurbar (35 km from Navapur)',
    reason: 'Targeted second-trimester anomaly ultrasound scan and obstetric evaluation.',
    clinicalNotes: 'Primigravida at 24 weeks gestation with moderate pallor.',
    createdBy: 'Dr. Anjali Sharma',
    createdAt: '2026-09-05 11:15',
    status: 'Accepted',
  },
  {
    id: 'RC-REF-2026-1039',
    patientId: 'RC-2026-009912',
    patientName: 'Ganesh Shinde',
    patientAge: 45,
    patientGender: 'Male',
    priority: 'Emergency',
    requiredSpecialty: 'Cardiology / Acute Cardiac Care',
    destinationFacility: 'Nashik Civil Hospital (Cardiac Unit)',
    facilityType: 'Super Specialty Hospital',
    destinationLocation: 'Nashik (120 km)',
    reason: 'Acute coronary syndrome presentation with chest pain radiating to left arm and ST elevations.',
    clinicalNotes: 'Initial loading dose given at PHC. 108 Ambulance transfer initiated.',
    createdBy: 'Dr. Anjali Sharma',
    createdAt: '2026-09-04 09:20',
    status: 'In Transit',
  },
];

// Baseline Follow-Ups
const BASELINE_FOLLOWUPS: FollowUpRecord[] = [
  {
    id: 'FU-2026-081',
    patientId: 'RC-2026-004821',
    patientName: 'Suresh Patil',
    patientAge: 62,
    patientVillage: 'Virdi, Shirpur',
    reason: 'Post-antibiotic respiratory assessment and SpO2 re-check',
    date: '2026-09-07',
    time: '11:00 AM',
    mode: 'Teleconsultation',
    status: 'Scheduled',
    doctorName: 'Dr. Anjali Sharma',
  },
  {
    id: 'FU-2026-082',
    patientId: 'RC-2026-003290',
    patientName: 'Kavita Gawit',
    patientAge: 28,
    patientVillage: 'Khandbara, Navapur',
    reason: 'Review Hb blood test results & fetal movement log',
    date: '2026-09-07',
    time: '02:30 PM',
    mode: 'Health-worker follow-up',
    status: 'Scheduled',
    doctorName: 'Dr. Anjali Sharma',
  },
  {
    id: 'FU-2026-083',
    patientId: 'RC-2026-002115',
    patientName: 'Namdeo Sonawane',
    patientAge: 54,
    patientVillage: 'Adavad, Chopda',
    reason: 'Follow-up fasting blood sugar and BP control',
    date: '2026-09-09',
    time: '10:30 AM',
    mode: 'In-person',
    status: 'Scheduled',
    doctorName: 'Dr. Anjali Sharma',
  },
  {
    id: 'FU-2026-079',
    patientId: 'RC-2026-001042',
    patientName: 'Aarav Bhil',
    patientAge: 6,
    patientVillage: 'Dahiwel, Sakri',
    reason: 'Verify diarrhea resolution and stool frequency',
    date: '2026-09-06',
    time: '04:00 PM',
    mode: 'Health-worker follow-up',
    status: 'Missed',
    doctorName: 'Dr. Anjali Sharma',
  },
];

/**
 * Service providing isolated, clinical-grade mock data for the Doctor Portal.
 * Automatically incorporates newly registered patients from localStorage.
 */
class DoctorMockService {
  private patients: ClinicalPatient[] = [...BASELINE_PATIENTS];
  private queue: ConsultationQueueItem[] = [...BASELINE_QUEUE];
  private timelines: Record<string, ClinicalTimelineEvent[]> = { ...BASELINE_TIMELINES };
  private referrals: ReferralRecord[] = [...BASELINE_REFERRALS];
  private followUps: FollowUpRecord[] = [...BASELINE_FOLLOWUPS];
  private consultations: ConsultationRecord[] = [];

  constructor() {
    this.syncFromLocalStorage();
  }

  // Sync patients that were created in Step 2 (Health Worker Registration)
  private syncFromLocalStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('ruralcare_local_patients');
        if (stored) {
          const registeredList: RegisteredPatientResult[] = JSON.parse(stored);
          registeredList.forEach((reg) => {
            // Check if already in patient list
            if (!this.patients.some((p) => p.id === reg.patientId)) {
              const newPatient: ClinicalPatient = {
                id: reg.patientId,
                fullName: reg.fullName,
                age: reg.age,
                gender: reg.gender === 'Female' ? 'Female' : reg.gender === 'Other' ? 'Other' : 'Male',
                preferredLanguage: (reg.preferredLanguage as 'en' | 'mr' | 'hi') || 'mr',
                village: reg.village,
                taluka: reg.taluka,
                district: reg.district,
                phone: reg.mobileNumber,
                emergencyContact: {
                  name: reg.emergencyContact.name || 'Family member',
                  relation: reg.emergencyContact.relation || 'Relative',
                  phone: reg.emergencyContact.phone || reg.mobileNumber,
                },
                allergies: reg.allergies ? [reg.allergies] : ['None reported'],
                existingConditions: reg.conditions.length > 0 ? reg.conditions : ['None reported'],
                currentMedications: reg.currentMedications ? [reg.currentMedications] : ['None reported'],
                registeredDate: reg.registeredAt || 'Today',
              };
              this.patients.unshift(newPatient);

              // Also generate a corresponding queue item
              const queueItem: ConsultationQueueItem = {
                id: `CQ-${Math.floor(100 + Math.random() * 900)}`,
                tokenNumber: `P-0${this.queue.length + 1}`,
                patientId: reg.patientId,
                patientName: reg.fullName,
                age: reg.age,
                gender: reg.gender,
                village: reg.village,
                taluka: reg.taluka,
                district: reg.district,
                chiefComplaint: 'New patient intake & baseline clinical evaluation',
                symptomsDuration: '1 day',
                symptomsList: ['General malaise', 'Routine health intake'],
                riskLevel: 'LOW',
                priority: 'ROUTINE',
                waitingTime: '5 min',
                status: 'waiting',
                assignedDoctor: 'Dr. Anjali Sharma',
                vitals: {
                  temperature: '98.4°F',
                  heartRate: '76 bpm',
                  bloodPressure: '120/80 mmHg',
                  spo2: '98%',
                  respiratoryRate: '16 /min',
                  recordedAt: 'Just now',
                  recordedBy: 'Sunita Shinde, ANM',
                },
                triage: {
                  riskLevel: 'LOW',
                  priority: 'ROUTINE',
                  reportedIndicators: ['Routine intake', 'Normal vitals'],
                  aiSummary: 'Patient newly registered at rural sub-center. Vitals within standard physiological limits.',
                  recommendedNextStep: 'Perform baseline physical check, verify vaccination and chronic history.',
                  disclaimer: 'Decision-support information generated from reported symptoms and available vitals. Not a diagnosis.',
                },
              };
              this.queue.unshift(queueItem);
            }
          });
        }
      }
    } catch (e) {
      console.warn('Error reading local patient store:', e);
    }
  }

  // 1. Get KPI summary
  public getKpiSummary(): DoctorKpiSummary {
    this.syncFromLocalStorage();
    const urgentCount = this.queue.filter((q) => q.riskLevel === 'HIGH' || q.priority === 'URGENT').length;
    const todayQueueCount = this.queue.filter((q) => q.status !== 'completed').length;
    const pendingReferralsCount = this.referrals.filter((r) => r.status === 'Pending').length;
    const todayFollowUpsCount = this.followUps.filter((f) => f.date === '2026-09-07' && f.status === 'Scheduled').length;

    return {
      todayQueueCount,
      urgentCount,
      teleconsultCount: 5,
      pendingReferralsCount,
      todayFollowUpsCount,
    };
  }

  // 2. Get consultation queue
  public getQueue(filterTab: 'all' | 'urgent' | 'waiting' | 'in_consultation' | 'completed' = 'all'): ConsultationQueueItem[] {
    this.syncFromLocalStorage();
    switch (filterTab) {
      case 'urgent':
        return this.queue.filter((q) => q.riskLevel === 'HIGH' || q.priority === 'URGENT');
      case 'waiting':
        return this.queue.filter((q) => q.status === 'waiting');
      case 'in_consultation':
        return this.queue.filter((q) => q.status === 'in_consultation');
      case 'completed':
        return this.queue.filter((q) => q.status === 'completed');
      default:
        return this.queue;
    }
  }

  // 3. Get single queue item by ID or Patient ID
  public getQueueItem(identifier: string): ConsultationQueueItem | undefined {
    this.syncFromLocalStorage();
    return this.queue.find((q) => q.id === identifier || q.patientId === identifier);
  }

  // 4. Get patient details
  public getPatient(patientId: string): ClinicalPatient | undefined {
    this.syncFromLocalStorage();
    return this.patients.find((p) => p.id === patientId);
  }

  // 5. Get all patients
  public getAllPatients(): ClinicalPatient[] {
    this.syncFromLocalStorage();
    return this.patients;
  }

  // 6. Search patients
  public searchPatients(query: string): ClinicalPatient[] {
    this.syncFromLocalStorage();
    const q = query.trim().toLowerCase();
    if (!q) return this.patients;
    return this.patients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.taluka.toLowerCase().includes(q)
    );
  }

  // 7. Get longitudinal timeline
  public getPatientTimeline(patientId: string): ClinicalTimelineEvent[] {
    if (this.timelines[patientId]) {
      return this.timelines[patientId];
    }
    // Return standard baseline timeline if newly created
    return [
      {
        id: `TL-NEW-${patientId}`,
        date: '2026-09-07',
        type: 'Visit',
        title: 'Initial Registration & Vitals Intake',
        facility: 'Shirpur Rural PHC / Field Station',
        doctorOrWorker: 'Sunita Shinde, ANM',
        details: 'Patient registered into RuralCare Connect digital health records platform.',
      },
    ];
  }

  // 8. Save or update a clinical consultation
  public saveConsultation(consultation: ConsultationRecord): void {
    const existingIndex = this.consultations.findIndex((c) => c.id === consultation.id);
    if (existingIndex >= 0) {
      this.consultations[existingIndex] = consultation;
    } else {
      this.consultations.unshift(consultation);
    }

    // Update queue item status to completed
    const qItem = this.queue.find((q) => q.patientId === consultation.patientId);
    if (qItem) {
      qItem.status = 'completed';
    }

    // Add to timeline
    const timelineEvent: ClinicalTimelineEvent = {
      id: `TL-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Consultation',
      title: `Physician Consultation: ${consultation.chiefComplaint.slice(0, 45)}...`,
      facility: consultation.facility,
      doctorOrWorker: consultation.doctorName,
      details: `Assessment: ${consultation.doctorAssessment}. Plan: ${consultation.treatmentPlan}. Prescribed ${consultation.prescriptions.length} medication(s).`,
      badge: 'Completed',
    };

    if (!this.timelines[consultation.patientId]) {
      this.timelines[consultation.patientId] = [];
    }
    this.timelines[consultation.patientId].unshift(timelineEvent);
  }

  // 9. Create referral
  public createReferral(referral: Omit<ReferralRecord, 'id' | 'createdAt' | 'status'>): ReferralRecord {
    const newRecord: ReferralRecord = {
      ...referral,
      id: `RC-REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending',
    };
    this.referrals.unshift(newRecord);

    // Update patient timeline
    const timelineEvent: ClinicalTimelineEvent = {
      id: `TL-REF-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Referral',
      title: `Referral to ${newRecord.destinationFacility} (${newRecord.requiredSpecialty})`,
      facility: 'Shirpur Rural PHC',
      doctorOrWorker: newRecord.createdBy,
      details: `Priority: ${newRecord.priority}. Reason: ${newRecord.reason}. Notes: ${newRecord.clinicalNotes}`,
      badge: newRecord.priority,
    };

    if (!this.timelines[newRecord.patientId]) {
      this.timelines[newRecord.patientId] = [];
    }
    this.timelines[newRecord.patientId].unshift(timelineEvent);

    return newRecord;
  }

  // 10. Get referrals
  public getReferrals(): ReferralRecord[] {
    return this.referrals;
  }

  // 11. Schedule follow up
  public scheduleFollowUp(followUp: Omit<FollowUpRecord, 'id' | 'status'>): FollowUpRecord {
    const newRecord: FollowUpRecord = {
      ...followUp,
      id: `FU-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Scheduled',
    };
    this.followUps.unshift(newRecord);
    return newRecord;
  }

  // 12. Get follow ups
  public getFollowUps(): FollowUpRecord[] {
    return this.followUps;
  }
}

export const doctorMockService = new DoctorMockService();
