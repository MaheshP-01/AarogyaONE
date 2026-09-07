# ArogyaOne 🏥

> **AI-Assisted Rural Healthcare Platform for Underserved Communities in Maharashtra**  
> *Smart India Hackathon (SIH) 2026 MVP*

---

## 1. Project Overview
**ArogyaOne** is a digital healthcare platform designed to bridge critical gaps in primary healthcare delivery across rural Maharashtra. It establishes a real-time, unified workflow between:
* **Frontline Health Workers (ASHA / ANM / Community Health Officers)** stationed at village sub-centers
* **Consulting Medical Officers & Specialists** at Primary Health Centres (PHCs), Community Health Centres (CHCs), and District Hospitals
* **Rural Patients & Families** needing timely, affordable, and continuous care

---

## 2. Problem Being Solved
Rural populations in Maharashtra face severe systemic healthcare challenges:
* **Geographic Isolation & Long Travel Distances**: Rural patients frequently travel 30–80 km to access basic medical consultations.
* **Severe Shortage of Specialists**: Primary healthcare facilities lack specialist doctors, leading to delayed diagnoses.
* **Fragmented Health Records**: Paper-based records are routinely lost or inaccessible across hospital referrals.
* **Language Barriers**: Complex medical terminology creates miscommunication between urban doctors and Marathi-speaking patients.
* **Poor Network Connectivity**: Intermittent 2G/3G connectivity prevents standard web applications from functioning reliably in remote hamlets.

---

## 3. Architecture
RuralCare Connect is structured as a decoupled monorepo comprising three specialized services:

```
[ Frontend: React + Vite + TS (PWA) ] ── (Port 5173)
                 │
                 ▼  REST API
[ Backend: Node.js + Express + TS ]  ── (Port 5000) ── [ MongoDB / Mongoose ]
                 │
                 ▼  Internal REST
[ AI Service: Python + FastAPI ]     ── (Port 8000)
```

### Important Medical & Safety Guardrail
> [!IMPORTANT]
> **AI is strictly clinical decision support, NOT a diagnostic engine.**  
> The AI microservice assists health workers with structured symptom summarization, triage risk stratification (Red / Yellow / Green), and regional language translation. Final medical decisions, clinical evaluations, and prescriptions remain solely with certified medical practitioners.

---

## 4. Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS v4, React Router v6, Axios, PWA Ready |
| **Backend** | Node.js, Express.js, TypeScript, REST API, Mongoose (MongoDB-ready), Dotenv, Morgan |
| **AI Service** | Python 3.13, FastAPI, Pydantic, Uvicorn |
| **Development**| Git, ESLint, Prettier, Postman/cURL |

---

## 5. Folder Structure

```
d:\SIH\2026\MVP\
├── frontend/                     # React + Vite + TypeScript Client
│   ├── public/
│   │   ├── favicon.svg           # Health icon branding
│   │   └── manifest.json         # PWA configuration
│   ├── src/
│   │   ├── assets/               # Static assets
│   │   ├── components/
│   │   │   ├── common/           # Header, Footer, LanguageSelector
│   │   │   └── landing/          # RoleCard component
│   │   ├── hooks/                # useLanguage hook
│   │   ├── layouts/              # MainLayout wrapper
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx   # Platform landing & live status
│   │   │   ├── HealthWorkerPage.tsx # Frontline portal placeholder
│   │   │   ├── DoctorPage.tsx    # Doctor teleconsultation placeholder
│   │   │   └── PatientPage.tsx   # Patient health portal placeholder
│   │   ├── services/             # Axios API clients (backend & AI)
│   │   ├── types/                # Shared TypeScript definitions
│   │   ├── utils/                # Constants and configurations
│   │   ├── App.tsx               # Route mapping
│   │   ├── index.css             # Tailwind CSS tokens
│   │   └── main.tsx              # React DOM entrypoint
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── backend/                      # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── config/               # Database & environment configuration
│   │   ├── controllers/          # Health & future business controllers
│   │   ├── middleware/           # Error handling & request logging
│   │   ├── models/               # MongoDB schema placeholders (.gitkeep)
│   │   ├── routes/               # API route aggregators
│   │   ├── services/             # Domain service placeholders (.gitkeep)
│   │   ├── utils/                # Helper utilities (.gitkeep)
│   │   ├── app.ts                # Express application setup
│   │   └── server.ts             # Server startup & graceful shutdown
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── ai-service/                   # Python + FastAPI Decision Support Service
│   ├── app/
│   │   ├── api/                  # API routers & health routes
│   │   ├── models/               # Pydantic schemas
│   │   ├── services/             # AI service placeholders
│   │   ├── utils/                # AI utility helpers
│   │   └── main.py               # FastAPI entrypoint
│   ├── requirements.txt
│   └── .env.example
│
├── docs/                         # Architecture documentation
├── .gitignore                    # Project-wide gitignore
├── .env.example                  # Root environment template
├── package.json                  # Root monorepo scripts
└── README.md
```

---

## 6. How to Install Dependencies

### Prerequisites
* **Node.js**: v20+ or v24+
* **npm**: v10+ or v11+
* **Python**: v3.11+ or v3.13+
* **Git**: v2.40+

### Step-by-Step Installation

1. **Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

2. **Backend Dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **AI Service Dependencies**:
   ```bash
   cd ai-service
   pip install -r requirements.txt
   cd ..
   ```

---

## 7. How to Run Frontend
```bash
cd frontend
npm run dev
```
* **URL**: `http://localhost:5173`
* **Routes Available**:
  * `/` — Platform Landing & Architecture Health Status
  * `/health-worker` — Health Worker Portal (ASHA/ANM)
  * `/doctor` — Doctor Teleconsultation Portal
  * `/patient` — Patient Portal

---

## 8. How to Run Backend
```bash
cd backend
npm run dev
```
* **URL**: `http://localhost:5000`
* **Health Check**: `GET http://localhost:5000/api/health`
  ```json
  {
    "status": "ok",
    "service": "backend"
  }
  ```

---

## 9. How to Run AI Service
```bash
cd ai-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
* **URL**: `http://localhost:8000`
* **Health Check**: `GET http://localhost:8000/health`
  ```json
  {
    "status": "ok",
    "service": "ai-service"
  }
  ```
* **Interactive Docs**: `http://localhost:8000/docs`

---

## 10. Environment Variables

Copy `.env.example` to `.env` in respective directories before starting:

### Backend (`backend/.env`):
```env
NODE_ENV=development
BACKEND_PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/ruralcare_connect
JWT_SECRET=your_jwt_secret_key_placeholder
AI_SERVICE_URL=http://localhost:8000
```

### AI Service (`ai-service/.env`):
```env
AI_SERVICE_PORT=8000
HOST=0.0.0.0
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_placeholder
BACKEND_URL=http://localhost:5000
```

### Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000
VITE_DEFAULT_LOCALE=en
```

---

## 11. Current Implementation Status (Step 1 Complete)
> [!NOTE]
> **Step 1 is the Project Foundation only.**  
> Business logic, medical data, triage models, and auth are intentionally not implemented yet.

* [x] Monorepo structure with decoupled services
* [x] React + Vite + TypeScript frontend with Tailwind CSS v4
* [x] Responsive healthcare UI with role navigation (Health Worker, Doctor, Patient)
* [x] Architectural preparation for Marathi, Hindi, and English localization
* [x] Express.js + TypeScript backend with CORS, request logging, and error handling
* [x] Backend health endpoint (`GET /api/health`)
* [x] MongoDB/Mongoose connection module configured
* [x] FastAPI AI microservice with Pydantic schemas
* [x] AI Service health endpoint (`GET /health`)
* [x] Clean `.gitignore` and `.env.example` configurations
* [x] Git repository initialized

---

## 12. Future MVP Modules (Step 2+)
The following modules will be built in subsequent steps of the 36-hour hackathon:
1. **Patient Registration & ABHA Linkage**: Demographic and longitudinal record intake.
2. **AI-Assisted Digital Triage**: Structured symptom gathering, emergency red flags, and risk scoring (Red/Yellow/Green).
3. **Multilingual Audio/Text Engine**: Voice transcription and translation for Marathi and Hindi.
4. **Doctor Teleconsultation & Video**: Low-bandwidth virtual consultation queue.
5. **Smart Referral & Emergency Escalation**: Automated referral slip generation to District Hospitals.
6. **Offline & Low-Connectivity Sync**: IndexedDB caching with background sync.
