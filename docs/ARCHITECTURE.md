# RuralCare Connect — Architecture Specification

## 1. Executive Summary
**RuralCare Connect** is a 3-tier, decoupled digital healthcare platform engineered specifically for rural primary healthcare centers (PHC), sub-centers, and district hospitals in Maharashtra. It connects frontline health workers (ASHA/ANM), consulting medical officers, and patients.

## 2. Core Architecture Principles
1. **Decoupled Architecture**: Frontend, Backend REST API, and AI Microservice operate independently.
2. **Clinical Decision Support Boundary**: The AI service **never** claims diagnostic authority. It provides structured symptom extraction, risk triage scoring (Red / Yellow / Green), follow-up prompt suggestions, and regional language translations. All medical decisions and prescriptions remain the exclusive domain of licensed medical practitioners.
3. **Offline & Low-Bandwidth Priority**: Frontline field workers face intermittent cellular connectivity. The client architecture is designed to support local caching, offline form queueing, and low-bitrate teleconsultation fallbacks.
4. **Multilingual Inclusivity**: Architectural scaffolding accommodates English, Marathi (मराठी), and Hindi (हिन्दी) for health workers and patients.

## 3. Component Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │               Frontend Client (React + Vite)           │
                    │   - ASHA / Health Worker Portal                        │
                    │   - Doctor Teleconsultation Workstation                │
                    │   - Patient Self-Care & Digital Card View              │
                    │   - PWA Service Worker & IndexedDB Cache               │
                    └───────────────────┬────────────────────────────────────┘
                                        │
                                        │ REST / JSON (HTTP)
                                        ▼
                    ┌────────────────────────────────────────────────────────┐
                    │               Backend Service (Node.js + Express)      │
                    │   - Port: 5000                                         │
                    │   - JWT Auth & RBAC (Future)                           │
                    │   - Longitudinal Health Record Store                   │
                    │   - Teleconsultation & Referral Router                 │
                    │   - MongoDB Mongoose ORM                               │
                    └───────────────────┬────────────────────────────────────┘
                                        │
                                        │ Internal REST (HTTP)
                                        ▼
                    ┌────────────────────────────────────────────────────────┐
                    │               AI Microservice (FastAPI + Python)       │
                    │   - Port: 8000                                         │
                    │   - Clinical Decision Support & Triage                 │
                    │   - Symptom Summarization & Risk Prioritization        │
                    │   - Multilingual Translation Relay                     │
                    └────────────────────────────────────────────────────────┘
```

## 4. Endpoints Baseline (Step 1)
- **Frontend**: `http://localhost:5173`
  - `/` — Platform Overview & Role Cards
  - `/health-worker` — Health Worker Portal
  - `/doctor` — Doctor Teleconsultation Portal
  - `/patient` — Patient Portal
- **Backend**: `http://localhost:5000`
  - `GET /` — API Information
  - `GET /api/health` — Returns `{"status": "ok", "service": "backend"}`
- **AI Service**: `http://localhost:8000`
  - `GET /` — Microservice Information
  - `GET /health` — Returns `{"status": "ok", "service": "ai-service"}`
