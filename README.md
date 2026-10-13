# ContractAI — Student Intelligence Platform

> **AI-powered contact intelligence and contract analysis platform built for students. Works 100% offline — no internet required for the hackathon demo.**

---

## ⚡ Quick Start (Hackathon Demo)

### Option 1 — Double-click launcher (easiest)
```
Desktop → Launch_ContractAI.bat
```

### Option 2 — Manual start
**Terminal 1 (Backend):**
```powershell
cd d:\final_project_demo\backend
..\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 (Frontend):**
```powershell
cd d:\final_project_demo\frontend
npm run dev
```

Then open: **http://localhost:5173**

---

## 🔐 Demo Credentials

| Field | Value |
|-------|-------|
| Email | `student@university.edu` |
| Password | `student123` |

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend App | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

---

## 📴 Offline Demo Mode

**The app runs entirely on your laptop — no internet connection is needed.**

### What works offline:
- ✅ Registration and Login (localStorage-based with backend fallback)
- ✅ Contact Analyzer — Add, Edit, Delete, Search, Filter contacts
- ✅ Load Demo Data — 20 realistic student contacts across 7 categories
- ✅ AI-Powered Analysis (rule-based local engine — no API calls)
- ✅ Smart Insights — Network health score, duplicate detection, inactive contacts
- ✅ Risk/Pattern Detection — Identifies high-priority & inactive contacts
- ✅ Reports & Analytics — CSV Export, Print reports
- ✅ Contract Analyzer — Upload contracts or paste text for clause extraction
- ✅ History — Browse previously analyzed contracts
- ✅ Report Downloads — PDF (via backend) or plain-text (offline fallback)

### Internet dependencies removed:
- ❌ OpenAI API — **removed, no calls made**
- ❌ Gemini API — **key is empty in .env, falls back to local heuristics engine**
- ❌ External CDN fonts — **not used, all fonts are system fonts**
- ❌ External CDN scripts — **none, all packages bundled locally**

---

## 📁 Project Structure

```
final_project_demo/
├── frontend/              # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Authentication
│   │   │   ├── Register.jsx     # Registration with validation
│   │   │   ├── Dashboard.jsx    # Main 6-tab application dashboard
│   │   │   ├── Analyzer.jsx     # Contract upload and analysis
│   │   │   ├── Results.jsx      # Analysis results viewer
│   │   │   ├── History.jsx      # Analysis history
│   │   │   └── About.jsx        # Tech stack info
│   │   ├── services/
│   │   │   ├── api.js           # Auth + Contract + Analysis services (offline-aware)
│   │   │   ├── contactService.js  # Contact CRUD (100% localStorage)
│   │   │   └── demoDataService.js # Offline demo data + local analysis engine
│   │   └── components/
│   │       ├── Navbar.jsx       # Auth-aware navbar with Offline Demo indicator
│   │       ├── ProtectedRoute.jsx
│   │       └── PublicOnlyRoute.jsx
├── backend/               # FastAPI + Python + MongoDB
│   ├── app/
│   │   ├── routes/        # Auth, Contracts, Analysis, Reports
│   │   └── services/
│   │       └── ai_service.py  # Gemini API + Local heuristics fallback
│   └── .env               # GEMINI_API_KEY= (empty = offline mode)
├── start_all.bat          # Project launcher
└── README.md
```

---

## 🎯 Demo Walkthrough (Hackathon Presentation)

1. **Start** — Double-click `Launch_ContractAI.bat` on Desktop
2. **Open** — Browser opens http://localhost:5173
3. **Login** — Use `student@university.edu` / `student123`
4. **Dashboard** → Click **Load Demo Data** (green button) → 20 contacts loaded instantly
5. **Contact Analyzer** tab — Show contacts across Teachers, Friends, Internship, Placement, Hackathon, Professional
6. **AI-Powered Analysis** tab — Show network health score, pattern analysis
7. **Smart Insights** tab — Show duplicates, inactive high-priority contacts, recommendations
8. **Risk Detection** tab — Show risk alerts and action items
9. **Reports** tab — Show full contact table, export CSV
10. **Contract AI** (nav link) → Upload or paste an internship agreement → Analyze → View findings
11. **History** (nav link) → Shows demo pre-loaded contract analyses
12. **Download Report** → Downloads either PDF (if backend running) or plain-text fallback

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v7, Tailwind CSS v4 |
| Backend | FastAPI, Uvicorn, Python 3.10+ |
| PDF Parsing | PyMuPDF (fitz) |
| Database | MongoDB (local service) + in-memory fallback |
| AI Analysis | Rule-based local heuristics (offline) + Gemini 1.5 Flash (optional) |
| Auth | JWT + bcrypt (backend) + localStorage (frontend fallback) |
| Reports | ReportLab PDF (backend) + plain-text (offline fallback) |
| Storage | localStorage for contacts, contacts, analyses (100% offline) |

---

## 📋 Environment

- Node.js 24.18+
- Python 3.10+ in `venv/`
- MongoDB running as Windows service on port 27017
- No external API keys required (Gemini key intentionally left empty)

---

*Built for offline hackathon demo — Student Contact Intelligence Platform*
