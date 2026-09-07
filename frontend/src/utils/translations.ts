import { LanguageCode } from '../types';

export interface TranslationDictionary {
  // Brand & Header
  appTitle: string;
  appSubtitle: string;
  onlineStatus: string;
  offlineStatus: string;
  healthWorkerRole: string;
  phcName: string;

  // Sidebar
  navDashboard: string;
  navRegistration: string;
  navPatients: string;
  navAppointments: string;
  navTriage: string;
  navReferrals: string;
  navFollowUps: string;
  newBadge: string;

  // Page Header
  pageTitle: string;
  pageSubtitle: string;
  cancelBtn: string;
  cancelConfirmation: string;

  // Stepper
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;

  // Step 1: Basic Information
  basicInfoHeading: string;
  basicInfoDesc: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  dobLabel: string;
  dobHint: string;
  ageLabel: string;
  agePlaceholder: string;
  genderLabel: string;
  genderMale: string;
  genderFemale: string;
  genderOther: string;
  preferredLanguageLabel: string;
  langMarathi: string;
  langHindi: string;
  langEnglish: string;

  // Step 2: Contact & Location
  contactLocationHeading: string;
  contactLocationDesc: string;
  mobileLabel: string;
  mobilePlaceholder: string;
  mobileHelp: string;
  alternateContactLabel: string;
  alternateContactPlaceholder: string;
  districtLabel: string;
  districtPlaceholder: string;
  talukaLabel: string;
  talukaPlaceholder: string;
  villageLabel: string;
  villagePlaceholder: string;
  pinCodeLabel: string;
  pinCodePlaceholder: string;
  useLocationBtn: string;
  locatingText: string;
  locationSuccess: string;
  locationError: string;

  // Step 3: Health Information
  healthInfoHeading: string;
  healthInfoDesc: string;
  allergiesLabel: string;
  allergiesPlaceholder: string;
  conditionsLabel: string;
  conditionsHint: string;
  conditionHypertension: string;
  conditionDiabetes: string;
  conditionAsthma: string;
  conditionHeartDisease: string;
  conditionTuberculosis: string;
  conditionArthritis: string;
  conditionNone: string;
  otherConditionsLabel: string;
  otherConditionsPlaceholder: string;
  medicationsLabel: string;
  medicationsPlaceholder: string;
  emergencyHeading: string;
  emergencyNameLabel: string;
  emergencyNamePlaceholder: string;
  emergencyRelationLabel: string;
  emergencyRelationPlaceholder: string;
  emergencyPhoneLabel: string;
  emergencyPhonePlaceholder: string;
  clinicalNoteHeading: string;
  clinicalNoteText: string;

  // Step 4: Review
  reviewHeading: string;
  reviewDesc: string;
  patientInfoCard: string;
  contactLocationCard: string;
  healthInfoCard: string;
  consentText: string;
  backBtn: string;
  continueBtn: string;
  submitBtn: string;
  submittingText: string;

  // Success State
  successTitle: string;
  successSubtitle: string;
  patientIdLabel: string;
  copyIdBtn: string;
  copiedText: string;
  registeredDateLabel: string;
  registeredByLabel: string;
  viewRecordBtn: string;
  startAssessmentBtn: string;
  registerAnotherBtn: string;

  // Validation
  errFullNameRequired: string;
  errAgeRequired: string;
  errAgeInvalid: string;
  errGenderRequired: string;
  errMobileInvalid: string;
  errAltMobileInvalid: string;
  errVillageRequired: string;
  errTalukaRequired: string;
  errDistrictRequired: string;
  errPinInvalid: string;
  errEmergencyPhoneInvalid: string;
  errConsentRequired: string;

  // Doctor Portal
  doctorPortalTitle: string;
  doctorFacility: string;
  doctorName: string;
  doctorSpecialty: string;
  navOverview: string;
  navDoctorQueue: string;
  navDoctorPatients: string;
  navDoctorTeleconsult: string;
  navDoctorReferrals: string;
  navDoctorFollowUps: string;
  navDoctorSettings: string;
  doctorGreeting: string;
  doctorGreetingSub: string;
  kpiTodayQueue: string;
  kpiUrgent: string;
  kpiTeleconsults: string;
  kpiReferrals: string;
  kpiFollowUps: string;
  urgentCasesHeading: string;
  allQueueHeading: string;
  startConsultBtn: string;
  reviewCaseBtn: string;
  aiTriageHeading: string;
  aiTriageSub: string;
  completeConsultBtn: string;
  saveDraftBtn: string;
  referPatientBtn: string;
  scheduleFollowUpBtn: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    // Brand & Header
    appTitle: 'ArogyaOne',
    appSubtitle: 'Public Healthcare Access Platform',
    onlineStatus: 'Online',
    offlineStatus: 'Offline — Data will sync when connection returns',
    healthWorkerRole: 'Sunita Shinde, ANM',
    phcName: 'Shirpur Rural PHC',

    // Sidebar
    navDashboard: 'Dashboard',
    navRegistration: 'Patient Registration',
    navPatients: 'Patients',
    navAppointments: 'Appointments',
    navTriage: 'Triage',
    navReferrals: 'Referrals',
    navFollowUps: 'Follow-ups',
    newBadge: 'New',

    // Page Header
    pageTitle: 'Patient Registration',
    pageSubtitle: 'Create a new patient record',
    cancelBtn: 'Cancel',
    cancelConfirmation: 'Are you sure you want to cancel? Unsaved registration data will be cleared.',

    // Stepper
    step1Title: '01 Basic Information',
    step2Title: '02 Contact & Location',
    step3Title: '03 Health Information',
    step4Title: '04 Review',

    // Step 1: Basic Information
    basicInfoHeading: 'Basic Patient Information',
    basicInfoDesc: 'Enter essential personal details for identification and longitudinal health records.',
    fullNameLabel: 'Full Name *',
    fullNamePlaceholder: "Enter patient's full name",
    dobLabel: 'Date of Birth (Optional)',
    dobHint: 'Selecting date of birth will auto-calculate age',
    ageLabel: 'Age *',
    agePlaceholder: 'e.g. 45',
    genderLabel: 'Gender *',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderOther: 'Other',
    preferredLanguageLabel: 'Preferred Language *',
    langMarathi: 'Marathi (मराठी)',
    langHindi: 'Hindi (हिंदी)',
    langEnglish: 'English',

    // Step 2: Contact & Location
    contactLocationHeading: 'Contact & Location Details',
    contactLocationDesc: 'Accurate village-level location helps ANM home visits and specialist teleconsultations.',
    mobileLabel: 'Mobile Number *',
    mobilePlaceholder: '10-digit mobile number',
    mobileHelp: 'Primary phone for SMS appointment reminders and emergency contact.',
    alternateContactLabel: 'Alternate Contact (Optional)',
    alternateContactPlaceholder: 'Alternate 10-digit number',
    districtLabel: 'District *',
    districtPlaceholder: 'Select district',
    talukaLabel: 'Taluka *',
    talukaPlaceholder: 'Select or enter taluka',
    villageLabel: 'Village / Settlement *',
    villagePlaceholder: 'Enter village or wadi / pada name',
    pinCodeLabel: 'PIN Code *',
    pinCodePlaceholder: '6-digit PIN code',
    useLocationBtn: 'Use Current Location',
    locatingText: 'Acquiring GPS...',
    locationSuccess: 'GPS coordinates captured',
    locationError: 'Could not acquire location. Please enter manually.',

    // Step 3: Health Information
    healthInfoHeading: 'Basic Health History',
    healthInfoDesc: 'Record self-reported conditions and known drug sensitivities before clinical examination.',
    allergiesLabel: 'Known Allergies',
    allergiesPlaceholder: 'e.g. Penicillin, Sulfa drugs, dust, or None reported',
    conditionsLabel: 'Existing Known Conditions',
    conditionsHint: 'Select all chronic conditions diagnosed previously by a medical doctor',
    conditionHypertension: 'Hypertension (BP)',
    conditionDiabetes: 'Diabetes',
    conditionAsthma: 'Asthma / Respiratory',
    conditionHeartDisease: 'Heart Condition',
    conditionTuberculosis: 'Tuberculosis (TB)',
    conditionArthritis: 'Arthritis',
    conditionNone: 'None reported',
    otherConditionsLabel: 'Other Medical Conditions',
    otherConditionsPlaceholder: 'Any other illness or surgical history',
    medicationsLabel: 'Current Medications',
    medicationsPlaceholder: 'e.g. Amlodipine 5mg once daily, Metformin, or None',
    emergencyHeading: 'Emergency Contact Person',
    emergencyNameLabel: 'Contact Person Name',
    emergencyNamePlaceholder: 'Family member or guardian',
    emergencyRelationLabel: 'Relationship',
    emergencyRelationPlaceholder: 'e.g. Spouse, Son, Daughter, Brother',
    emergencyPhoneLabel: 'Emergency Phone Number',
    emergencyPhonePlaceholder: '10-digit phone number',
    clinicalNoteHeading: 'Clinical Assessment Note',
    clinicalNoteText: 'Vitals will be recorded during the patient’s first clinical assessment. This form registers demographic and background data only.',

    // Step 4: Review
    reviewHeading: 'Review Patient Information',
    reviewDesc: 'Please verify all details carefully before generating the unique patient record ID.',
    patientInfoCard: 'Patient Information',
    contactLocationCard: 'Contact & Location',
    healthInfoCard: 'Health Information',
    consentText: 'I confirm that the information entered is accurate and verified with the patient or family guardian.',
    backBtn: 'Back',
    continueBtn: 'Continue',
    submitBtn: 'Create Patient Record',
    submittingText: 'Creating Record...',

    // Success State
    successTitle: 'Patient Registered Successfully',
    successSubtitle: 'A unique health identifier has been assigned. The record is ready for clinical assessment.',
    patientIdLabel: 'PATIENT ID',
    copyIdBtn: 'Copy ID',
    copiedText: 'Copied!',
    registeredDateLabel: 'Registration Time',
    registeredByLabel: 'Registered By',
    viewRecordBtn: 'View Patient Record',
    startAssessmentBtn: 'Start Health Assessment',
    registerAnotherBtn: 'Register Another Patient',

    // Validation
    errFullNameRequired: "Please enter the patient's full name",
    errAgeRequired: 'Please enter patient age',
    errAgeInvalid: 'Enter a valid age between 0 and 120',
    errGenderRequired: 'Please select patient gender',
    errMobileInvalid: 'Enter a valid 10-digit mobile number',
    errAltMobileInvalid: 'Enter a valid 10-digit alternate mobile number',
    errVillageRequired: 'Please enter village or settlement name',
    errTalukaRequired: 'Please select or enter taluka',
    errDistrictRequired: 'Please select district',
    errPinInvalid: 'Enter a valid 6-digit PIN code',
    errEmergencyPhoneInvalid: 'Enter a valid 10-digit emergency contact number',
    errConsentRequired: 'You must confirm that the information entered is accurate before submitting.',

    // Doctor Portal
    doctorPortalTitle: 'Doctor Clinical Workstation',
    doctorFacility: 'District Hospital, Dhule',
    doctorName: 'Dr. Anjali Sharma',
    doctorSpecialty: 'General Physician (MD Medicine)',
    navOverview: 'Overview',
    navDoctorQueue: 'Consultation Queue',
    navDoctorPatients: 'Patients',
    navDoctorTeleconsult: 'Teleconsultations',
    navDoctorReferrals: 'Referrals',
    navDoctorFollowUps: 'Follow-ups',
    navDoctorSettings: 'Settings',
    doctorGreeting: 'Good morning, Dr. Anjali',
    doctorGreetingSub: "Here's what needs your attention today.",
    kpiTodayQueue: "Today's Queue",
    kpiUrgent: 'Urgent Cases',
    kpiTeleconsults: 'Teleconsultations',
    kpiReferrals: 'Pending Referrals',
    kpiFollowUps: 'Follow-ups Today',
    urgentCasesHeading: 'Urgent Cases Requiring Review',
    allQueueHeading: "Today's Consultation Queue",
    startConsultBtn: 'Start Consultation',
    reviewCaseBtn: 'Review',
    aiTriageHeading: 'AI-Assisted Triage',
    aiTriageSub: 'Decision-support information generated from reported symptoms and available vitals. Not a diagnosis.',
    completeConsultBtn: 'Complete Consultation',
    saveDraftBtn: 'Save Draft',
    referPatientBtn: 'Refer Patient',
    scheduleFollowUpBtn: 'Schedule Follow-up',
  },

  mr: {
    // Brand & Header
    appTitle: 'आरोग्यवन (ArogyaOne)',
    appSubtitle: 'सार्वजनिक आरोग्य सेवा मंच',
    onlineStatus: 'ऑनलाइन',
    offlineStatus: 'ऑफलाइन — इंटरनेट सुरू झाल्यावर डेटा सिंक होईल',
    healthWorkerRole: 'सुनिता शिंदे, एएनएम (ANM)',
    phcName: 'शिरपूर ग्रामीण प्राथमिक आरोग्य केंद्र',

    // Sidebar
    navDashboard: 'डॅशबोर्ड',
    navRegistration: 'रुग्ण नोंदणी',
    navPatients: 'रुग्ण',
    navAppointments: 'अपॉइंटमेंट्स',
    navTriage: 'ट्रायज',
    navReferrals: 'रेफरल्स',
    navFollowUps: 'पाठपुरावा (फॉलो-अप)',
    newBadge: 'नवीन',

    // Page Header
    pageTitle: 'नवीन रुग्ण नोंदणी',
    pageSubtitle: 'नवीन रुग्णाची डिजिटल आरोग्य नोंद तयार करा',
    cancelBtn: 'रद्द करा',
    cancelConfirmation: 'तुम्हाला नक्की नोंदणी रद्द करायची आहे का? प्रविष्ट केलेली माहिती हटवली जाईल.',

    // Stepper
    step1Title: '०१ मूलभूत माहिती',
    step2Title: '०२ संपर्क व पत्ता',
    step3Title: '०३ आरोग्य माहिती',
    step4Title: '०४ तपासणी व खात्री',

    // Step 1: Basic Information
    basicInfoHeading: 'रुग्णाची प्राथमिक माहिती',
    basicInfoDesc: 'ओळख आणि कायमस्वरूपी आरोग्य नोंदीसाठी आवश्यक वैयक्तिक तपशील प्रविष्ट करा.',
    fullNameLabel: 'पूर्ण नाव *',
    fullNamePlaceholder: 'रुग्णाचे पूर्ण नाव प्रविष्ट करा',
    dobLabel: 'जन्मतारीख (ऐच्छिक)',
    dobHint: 'जन्मतारीख निवडल्यास वय आपोआप मोजले जाईल',
    ageLabel: 'वय *',
    agePlaceholder: 'उदा. ४५',
    genderLabel: 'लिंग *',
    genderMale: 'पुरुष',
    genderFemale: 'स्त्री',
    genderOther: 'इतर',
    preferredLanguageLabel: 'संभाषणाची भाषा *',
    langMarathi: 'मराठी',
    langHindi: 'हिंदी',
    langEnglish: 'इंग्रजी',

    // Step 2: Contact & Location
    contactLocationHeading: 'संपर्क आणि पत्ता तपशील',
    contactLocationDesc: 'अचूक गावाचा पत्ता आरोग्य सेविकांच्या गृहभेटीसाठी आणि तज्ज्ञ डॉक्टरांच्या सल्ल्यासाठी उपयुक्त ठरतो.',
    mobileLabel: 'मोबाईल क्रमांक *',
    mobilePlaceholder: '१० अंकी मोबाईल नंबर',
    mobileHelp: 'एसएमएस आणि तातडीच्या सूचनांसाठी प्राथमिक नंबर.',
    alternateContactLabel: 'पर्यायी संपर्क (ऐच्छिक)',
    alternateContactPlaceholder: 'दुसरा १० अंकी फोन नंबर',
    districtLabel: 'जिल्हा *',
    districtPlaceholder: 'जिल्हा निवडा',
    talukaLabel: 'तालुका *',
    talukaPlaceholder: 'तालुका निवडा किंवा लिहा',
    villageLabel: 'गाव / पाडा / वस्ती *',
    villagePlaceholder: 'गावाचे किंवा वस्तीचे नाव',
    pinCodeLabel: 'पिन कोड *',
    pinCodePlaceholder: '६ अंकी पिन कोड',
    useLocationBtn: 'सध्याचे स्थान वापरा',
    locatingText: 'जीपीएस स्थान शोधत आहे...',
    locationSuccess: 'जीपीएस स्थान नोंदवले',
    locationError: 'स्थान मिळवणे शक्य झाले नाही. कृपया हाताने लिहा.',

    // Step 3: Health Information
    healthInfoHeading: 'मागील आरोग्य इतिहास',
    healthInfoDesc: 'वैद्यकीय तपासणीपूर्वी रुग्णाचे जुने आजार आणि औषधांची ॲलर्जी नोंदवून ठेवा.',
    allergiesLabel: 'औषध किंवा इतर ॲलर्जी',
    allergiesPlaceholder: 'उदा. पेनिसिलिन, सल्फा, धूळ, किंवा कोणतीही नाही',
    conditionsLabel: 'पूर्वीचे जुनाट आजार',
    conditionsHint: 'पूर्वी डॉक्टरांनी निदान केलेले जुनाट आजार निवडा',
    conditionHypertension: 'उच्च रक्तदाब (BP)',
    conditionDiabetes: 'मधुमेह (शुगर)',
    conditionAsthma: 'दमा / श्वासविकार',
    conditionHeartDisease: 'हृदयरोग',
    conditionTuberculosis: 'टीबी (क्षयरोग)',
    conditionArthritis: 'संधिवात',
    conditionNone: 'कोणताही नाही',
    otherConditionsLabel: 'इतर आजार किंवा शस्त्रक्रिया',
    otherConditionsPlaceholder: 'इतर कोणताही आजार किंवा इतिहास',
    medicationsLabel: 'सध्या चालू असलेली औषधे',
    medicationsPlaceholder: 'उदा. बीपीची गोळी, किंवा चालू नाही',
    emergencyHeading: 'तातडीच्या संपर्काची व्यक्ती',
    emergencyNameLabel: 'व्यक्तीचे नाव',
    emergencyNamePlaceholder: 'कुटुंबातील व्यक्तीचे नाव',
    emergencyRelationLabel: 'नाते',
    emergencyRelationPlaceholder: 'उदा. पती, पत्नी, मुलगा, मुलगी',
    emergencyPhoneLabel: 'तातडीचा फोन नंबर',
    emergencyPhonePlaceholder: '१० अंकी फोन नंबर',
    clinicalNoteHeading: 'वैद्यकीय तपासणी सूचना',
    clinicalNoteText: 'रुग्णाची पहिली तपासणी करताना रक्तदाब, नाडी व इतर चाचण्या नोंदवल्या जातील. येथे केवळ प्राथमिक नोंदणी केली जाते.',

    // Step 4: Review
    reviewHeading: 'नोंदवलेल्या माहितीची तपासणी',
    reviewDesc: 'रुग्ण नोंदणी क्रमांक तयार करण्यापूर्वी कृपया सर्व माहिती काळजीपूर्वक तपासा.',
    patientInfoCard: 'रुग्णाची माहिती',
    contactLocationCard: 'संपर्क आणि पत्ता',
    healthInfoCard: 'आरोग्य माहिती',
    consentText: 'मी पुष्टी करतो/करते की नोंदवलेली माहिती अचूक आहे आणि रुग्ण किंवा पालकांकडून पडताळली आहे.',
    backBtn: 'मागे',
    continueBtn: 'पुढे जा',
    submitBtn: 'रुग्ण नोंदणी पूर्ण करा',
    submittingText: 'नोंदणी करत आहे...',

    // Success State
    successTitle: 'रुग्णाची नोंदणी यशस्वी झाली',
    successSubtitle: 'रुग्णाला युनिक ओळख क्रमांक देण्यात आला आहे. रेकॉर्ड वैद्यकीय तपासणीसाठी तयार आहे.',
    patientIdLabel: 'रुग्ण ओळख क्रमांक (PATIENT ID)',
    copyIdBtn: 'आयडी कॉपी करा',
    copiedText: 'कॉपी झाले!',
    registeredDateLabel: 'नोंदणी वेळ',
    registeredByLabel: 'नोंदणी करणारी व्यक्ती',
    viewRecordBtn: 'रुग्ण रेकॉर्ड पहा',
    startAssessmentBtn: 'आरोग्य तपासणी सुरू करा',
    registerAnotherBtn: 'दुसऱ्या रुग्णाची नोंदणी करा',

    // Validation
    errFullNameRequired: 'कृपया रुग्णाचे पूर्ण नाव प्रविष्ट करा',
    errAgeRequired: 'कृपया रुग्णाचे वय प्रविष्ट करा',
    errAgeInvalid: '० ते १२० दरम्यानचे वैध वय प्रविष्ट करा',
    errGenderRequired: 'कृपया रुग्णाचे लिंग निवडा',
    errMobileInvalid: 'कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा',
    errAltMobileInvalid: 'कृपया वैध १० अंकी पर्यायी नंबर प्रविष्ट करा',
    errVillageRequired: 'कृपया गाव किंवा वस्तीचे नाव प्रविष्ट करा',
    errTalukaRequired: 'कृपया तालुका निवडा',
    errDistrictRequired: 'कृपया जिल्हा निवडा',
    errPinInvalid: 'कृपया वैध ६ अंकी पिन कोड प्रविष्ट करा',
    errEmergencyPhoneInvalid: 'कृपया वैध १० अंकी तातडीचा फोन नंबर प्रविष्ट करा',
    errConsentRequired: 'नोंदणी पूर्ण करण्यासाठी कृपया माहितीची खात्री करा.',

    // Doctor Portal
    doctorPortalTitle: 'डॉक्टर क्लिनिकल वर्कस्टेशन',
    doctorFacility: 'जिल्हा रुग्णालय, धुळे',
    doctorName: 'डॉ. अंजली शर्मा',
    doctorSpecialty: 'जनरल फिजिशियन (एमडी मेडिसिन)',
    navOverview: 'आढावा',
    navDoctorQueue: 'तपासणी रांग',
    navDoctorPatients: 'रुग्ण यादी',
    navDoctorTeleconsult: 'टेलिकन्सल्टेशन',
    navDoctorReferrals: 'रेफरल्स',
    navDoctorFollowUps: 'पाठपुरावा',
    navDoctorSettings: 'सेटिंग्ज',
    doctorGreeting: 'शुभ प्रभात, डॉ. अंजली',
    doctorGreetingSub: 'आजच्या रुग्णांचे आणि तपासणीचे तपशील खालीलप्रमाणे आहेत.',
    kpiTodayQueue: 'आजची रांग',
    kpiUrgent: 'तातडीचे रुग्ण',
    kpiTeleconsults: 'टेलिकन्सल्टेशन्स',
    kpiReferrals: 'प्रलंबित रेफरल्स',
    kpiFollowUps: 'आजचा पाठपुरावा',
    urgentCasesHeading: 'त्वरित लक्ष देण्याची गरज असलेले रुग्ण',
    allQueueHeading: 'आजची तपासणी रांग',
    startConsultBtn: 'तपासणी सुरू करा',
    reviewCaseBtn: 'तपासा',
    aiTriageHeading: 'एआय-साहाय्यित ट्रायज',
    aiTriageSub: 'नोंदवलेली लक्षणे आणि तपासण्यांवर आधारित वैद्यकीय सहाय्यक माहिती. हे अंतिम निदान नाही.',
    completeConsultBtn: 'तपासणी पूर्ण करा',
    saveDraftBtn: 'मसुदा साठवा',
    referPatientBtn: 'रुग्ण रेफर करा',
    scheduleFollowUpBtn: 'फॉलो-अप तारीख द्या',
  },

  hi: {
    // Brand & Header
    appTitle: 'आरोग्यवन (ArogyaOne)',
    appSubtitle: 'सार्वजनिक स्वास्थ्य सेवा प्लेटफॉर्म',
    onlineStatus: 'ऑनलाइन',
    offlineStatus: 'ऑफलाइन — इंटरनेट शुरू होने पर डेटा सिंक होगा',
    healthWorkerRole: 'सुनीता शिंदे, एएनएम (ANM)',
    phcName: 'शिरपुर ग्रामीण प्राथमिक स्वास्थ्य केंद्र',

    // Sidebar
    navDashboard: 'डैशबोर्ड',
    navRegistration: 'मरीज पंजीकरण',
    navPatients: 'मरीज',
    navAppointments: 'अपॉइंटमेंट्स',
    navTriage: 'ट्रायज',
    navReferrals: 'रेफरल्स',
    navFollowUps: 'फॉलो-अप',
    newBadge: 'नया',

    // Page Header
    pageTitle: 'नया मरीज पंजीकरण',
    pageSubtitle: 'नए मरीज का डिजिटल स्वास्थ्य रिकॉर्ड तैयार करें',
    cancelBtn: 'रद्द करें',
    cancelConfirmation: 'क्या आप वाकई पंजीकरण रद्द करना चाहते हैं? दर्ज की गई जानकारी मिट जाएगी।',

    // Stepper
    step1Title: '०१ बुनियादी जानकारी',
    step2Title: '०२ संपर्क और पता',
    step3Title: '०३ स्वास्थ्य जानकारी',
    step4Title: '०४ समीक्षा और पुष्टि',

    // Step 1: Basic Information
    basicInfoHeading: 'मरीज की प्राथमिक जानकारी',
    basicInfoDesc: 'पहचान और दीर्घकालिक स्वास्थ्य रिकॉर्ड के लिए आवश्यक व्यक्तिगत विवरण दर्ज करें।',
    fullNameLabel: 'पूरा नाम *',
    fullNamePlaceholder: 'मरीज का पूरा नाम दर्ज करें',
    dobLabel: 'जन्म तिथि (वैकल्पिक)',
    dobHint: 'जन्म तिथि चुनने पर आयु स्वतः गिनी जाएगी',
    ageLabel: 'आयु *',
    agePlaceholder: 'उदा. ४५',
    genderLabel: 'लिंग *',
    genderMale: 'पुरुष',
    genderFemale: 'महिला',
    genderOther: 'अन्य',
    preferredLanguageLabel: 'बातचीत की भाषा *',
    langMarathi: 'मराठी',
    langHindi: 'हिंदी',
    langEnglish: 'अंग्रेजी',

    // Step 2: Contact & Location
    contactLocationHeading: 'संपर्क एवं पता विवरण',
    contactLocationDesc: 'सटीक गांव का पता स्वास्थ्य कार्यकर्ता के गृह भ्रमण और विशेषज्ञ परामर्श में मदद करता है।',
    mobileLabel: 'मोबाइल नंबर *',
    mobilePlaceholder: '१० अंकों का मोबाइल नंबर',
    mobileHelp: 'एसएमएस सूचनाओं और आपातकालीन संपर्क के लिए प्राथमिक फोन नंबर।',
    alternateContactLabel: 'वैकल्पिक संपर्क (वैकल्पिक)',
    alternateContactPlaceholder: 'वैकल्पिक १० अंकों का फोन नंबर',
    districtLabel: 'जिला *',
    districtPlaceholder: 'जिला चुनें',
    talukaLabel: 'तहसील / तालुका *',
    talukaPlaceholder: 'तालुका चुनें या लिखें',
    villageLabel: 'गांव / बस्ती / पाड़ा *',
    villagePlaceholder: 'गांव या बस्ती का नाम',
    pinCodeLabel: 'पिन कोड *',
    pinCodePlaceholder: '६ अंकों का पिन कोड',
    useLocationBtn: 'वर्तमान स्थान का उपयोग करें',
    locatingText: 'जीपीएस स्थान खोजा जा रहा है...',
    locationSuccess: 'जीपीएस स्थान दर्ज किया गया',
    locationError: 'स्थान प्राप्त नहीं हो सका। कृपया मैन्युअल दर्ज करें।',

    // Step 3: Health Information
    healthInfoHeading: 'पूर्व स्वास्थ्य इतिहास',
    healthInfoDesc: 'चिकित्सीय जांच से पहले मरीज की पुरानी बीमारियां और दवाओं की एलर्जी दर्ज करें।',
    allergiesLabel: 'दवा या अन्य एलर्जी',
    allergiesPlaceholder: 'उदा. पेनिसिलिन, सल्फा, धूल, या कोई नहीं',
    conditionsLabel: 'मौजूदा पुरानी बीमारियां',
    conditionsHint: 'डॉक्टर द्वारा पहले पहचानी गई बीमारियां चुनें',
    conditionHypertension: 'उच्च रक्तचाप (BP)',
    conditionDiabetes: 'मधुमेह (डायबिटीज)',
    conditionAsthma: 'दमा / श्वसन रोग',
    conditionHeartDisease: 'हृदय रोग',
    conditionTuberculosis: 'टीबी (क्षयरोग)',
    conditionArthritis: 'गठिया (आर्थराइटिस)',
    conditionNone: 'कोई नहीं',
    otherConditionsLabel: 'अन्य बीमारियां या सर्जरी',
    otherConditionsPlaceholder: 'अन्य कोई बीमारी या ऑपरेशन का इतिहास',
    medicationsLabel: 'वर्तमान में चल रही दवाएं',
    medicationsPlaceholder: 'उदा. बीपी की दवा, या कोई नहीं',
    emergencyHeading: 'आपातकालीन संपर्क व्यक्ति',
    emergencyNameLabel: 'व्यक्ति का नाम',
    emergencyNamePlaceholder: 'परिवार के सदस्य या अभिभावक का नाम',
    emergencyRelationLabel: 'रिश्ता',
    emergencyRelationPlaceholder: 'उदा. पति, पत्नी, बेटा, बेटी',
    emergencyPhoneLabel: 'आपातकालीन फोन नंबर',
    emergencyPhonePlaceholder: '१० अंकों का फोन नंबर',
    clinicalNoteHeading: 'नैदानिक परीक्षण सूचना',
    clinicalNoteText: 'मरीज की पहली जांच के दौरान ब्लड प्रेशर, पल्स और अन्य विटल्स दर्ज किए जाएंगे। यहां केवल प्राथमिक विवरण दर्ज किया जाता है।',

    // Step 4: Review
    reviewHeading: 'दर्ज विवरण की समीक्षा करें',
    reviewDesc: 'मरीज पहचान संख्या (ID) तैयार करने से पहले कृपया सभी विवरण ध्यानपूर्वक जांचें।',
    patientInfoCard: 'मरीज की जानकारी',
    contactLocationCard: 'संपर्क और पता',
    healthInfoCard: 'स्वास्थ्य जानकारी',
    consentText: 'मैं पुष्टि करता/करती हूं कि दर्ज की गई जानकारी सही है और मरीज/अभिभावक से सत्यापित की गई है।',
    backBtn: 'पीछे',
    continueBtn: 'आगे बढ़ें',
    submitBtn: 'मरीज रिकॉर्ड बनाएं',
    submittingText: 'रिकॉर्ड बन रहा है...',

    // Success State
    successTitle: 'मरीज का पंजीकरण सफलतापूर्वक संपन्न हुआ',
    successSubtitle: 'मरीज को विशिष्ट पहचान संख्या (ID) दे दी गई है। रिकॉर्ड चिकित्सकीय जांच के लिए तैयार है।',
    patientIdLabel: 'मरीज पहचान संख्या (PATIENT ID)',
    copyIdBtn: 'आईडी कॉपी करें',
    copiedText: 'कॉपी हो गया!',
    registeredDateLabel: 'पंजीकरण समय',
    registeredByLabel: 'पंजीकरणकर्ता',
    viewRecordBtn: 'मरीज रिकॉर्ड देखें',
    startAssessmentBtn: 'स्वास्थ्य जांच शुरू करें',
    registerAnotherBtn: 'दूसरे मरीज का पंजीकरण करें',

    // Validation
    errFullNameRequired: 'कृपया मरीज का पूरा नाम दर्ज करें',
    errAgeRequired: 'कृपया मरीज की आयु दर्ज करें',
    errAgeInvalid: '० से १२० के बीच मान्य आयु दर्ज करें',
    errGenderRequired: 'कृपया मरीज का लिंग चुनें',
    errMobileInvalid: 'कृपया मान्य १० अंकों का मोबाइल नंबर दर्ज करें',
    errAltMobileInvalid: 'कृपया मान्य १० अंकों का वैकल्पिक नंबर दर्ज करें',
    errVillageRequired: 'कृपया गांव या बस्ती का नाम दर्ज करें',
    errTalukaRequired: 'कृपया तालुका चुनें',
    errDistrictRequired: 'कृपया जिला चुनें',
    errPinInvalid: 'कृपया मान्य ६ अंकों का पिन कोड दर्ज करें',
    errEmergencyPhoneInvalid: 'कृपया मान्य १० अंकों का आपातकालीन फोन नंबर दर्ज करें',
    errConsentRequired: 'पंजीकरण पूरा करने के लिए कृपया जानकारी की पुष्टि करें।',

    // Doctor Portal
    doctorPortalTitle: 'डॉक्टर क्लिनिकल वर्कस्टेशन',
    doctorFacility: 'जिला अस्पताल, धुले',
    doctorName: 'डॉ. अंजलि शर्मा',
    doctorSpecialty: 'जनरल फिजिशियन (एमडी मेडिसिन)',
    navOverview: 'अवलोकन',
    navDoctorQueue: 'परामर्श कतार',
    navDoctorPatients: 'मरीज सूची',
    navDoctorTeleconsult: 'टेलीकंसल्टेशन',
    navDoctorReferrals: 'रेफरल्स',
    navDoctorFollowUps: 'फॉलो-अप',
    navDoctorSettings: 'सेटिंग्स',
    doctorGreeting: 'शुभ प्रभात, डॉ. अंजलि',
    doctorGreetingSub: 'आज जिन मरीजों पर आपका ध्यान चाहिए, उनका विवरण नीचे है।',
    kpiTodayQueue: 'आज की कतार',
    kpiUrgent: 'अति आवश्यक मामले',
    kpiTeleconsults: 'टेलीकंसल्टेशन्स',
    kpiReferrals: 'लंबित रेफरल्स',
    kpiFollowUps: 'आज का फॉलो-अप',
    urgentCasesHeading: 'तत्काल ध्यान देने योग्य मरीज',
    allQueueHeading: 'आज की परामर्श कतार',
    startConsultBtn: 'परामर्श शुरू करें',
    reviewCaseBtn: 'जांचें',
    aiTriageHeading: 'एआई-सहायित ट्रायज',
    aiTriageSub: 'दर्ज किए गए लक्षणों और विटल्स पर आधारित सहायक जानकारी। यह अंतिम निदान नहीं है।',
    completeConsultBtn: 'परामर्श पूरा करें',
    saveDraftBtn: 'ड्राफ्ट सहेजें',
    referPatientBtn: 'मरीज रेफर करें',
    scheduleFollowUpBtn: 'फॉलो-अप शेड्यूल करें',
  },
};
