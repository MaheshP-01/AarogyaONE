export type Gender = 'male' | 'female' | 'other';
export type PreferredLanguage = 'mr' | 'hi' | 'en';

export interface PatientRegistrationFormData {
  // Step 1: Basic Information
  fullName: string;
  dob: string;
  age: string;
  gender: Gender | '';
  preferredLanguage: PreferredLanguage;

  // Step 2: Contact & Location
  mobileNumber: string;
  alternateContact: string;
  village: string;
  taluka: string;
  district: string;
  pinCode: string;
  locationCoordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };

  // Step 3: Basic Health Information
  knownAllergies: string;
  existingConditions: string[];
  otherConditions: string;
  currentMedications: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;

  // Step 4: Confirmation
  consentConfirmed: boolean;
}

export type RegistrationStep = 1 | 2 | 3 | 4 | 'success';

export interface RegisteredPatientResult {
  patientId: string;
  fullName: string;
  age: string;
  gender: string;
  preferredLanguage: string;
  mobileNumber: string;
  village: string;
  taluka: string;
  district: string;
  pinCode: string;
  allergies: string;
  conditions: string[];
  currentMedications: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  registeredAt: string;
  registeredBy: string;
  phcLocation: string;
  syncStatus: 'synced' | 'pending_offline';
}

export interface FormErrors {
  fullName?: string;
  age?: string;
  gender?: string;
  preferredLanguage?: string;
  mobileNumber?: string;
  alternateContact?: string;
  village?: string;
  taluka?: string;
  district?: string;
  pinCode?: string;
  emergencyContactPhone?: string;
  consentConfirmed?: string;
  [key: string]: string | undefined;
}
