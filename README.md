# ContractAI — AI-Based Student Contract Analyzer
> *"Understand Before You Sign."*

A full-stack, AI-powered contract intelligence platform built specifically for students. ContractAI analyzes internship offers, employment agreements, hostel/PG accommodation contracts, coaching agreements, freelance contracts, and software subscriptions.

Rather than providing generic PDF summaries, ContractAI identifies **student-critical obligations, financial commitments, notice periods, lock-in clauses, early exit penalties, and restrictive covenants** — translating dense legalese into straightforward, student-friendly explanations with downloadable PDF analysis reports.

---

## 🌟 Key Features

1. **AI-Powered Clause Extraction**:
   - Deep analysis across 21 student-focused contractual categories (Stipends, Penalties, Notice Periods, Lock-ins, Working Hours, IP Rights, Non-Competes, Curfew/Hostel Rules, etc.).
   - Page-accurate clause referencing extracted directly with PyMuPDF.
2. **Student Obligations Dashboard (Core Differentiator)**:
   - Dedicated breakdown categorizing:
     - *What You Need to Pay*
     - *What You Need to Do*
     - *What You Cannot Do*
     - *When You Need to Give Notice*
     - *What Happens If You Cancel or Leave Early*
     - *Important Deadlines*
3. **Verbatim vs Plain-English Comparative View**:
   - Side-by-side comparison between the original legal wording and simplified student translations.
   - Attention priority badges (High, Medium, Low attention levels for students).
4. **Downloadable Branded PDF Reports**:
   - Generates multi-page, formatted PDF reports via ReportLab with executive summary, obligation tables, and detailed findings.
5. **MongoDB Persistence & History**:
   - Stores historical analyses, page counts, and extracted findings with instant re-opening and deletion.
6. **Dual-Mode AI Architecture**:
   - Ready for Google Gemini 1.5 Flash API or OpenAI API via `.env`.
   - Built-in smart NLP heuristic clause engine and demo contract loaders so the application functions 100% offline without requiring paid API keys!
7. **Premium Dark Tech & Electric Violet UI**:
   - Sleek, modern dark tech design (#050507) with electric violet accents, glassmorphic cards, responsive mobile layout, and zero rainbow clutter.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM, Tailwind CSS (v4), Lucide Icons, Axios |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2 |
| **PDF Extraction** | PyMuPDF (`pymupdf` / `fitz`) |
| **Database** | MongoDB (Motor async driver, PyMongo) |
| **AI Engine** | Google Gemini 1.5 Flash API (`google-generativeai`) + Smart Fallback NLP Engine |
| **Report Generation** | ReportLab |
| **Security & Auth** | Passlib, Bcrypt, PyJWT (JSON Web Tokens) |

---

## 📁 Folder Structure

```text
d:/final_project_demo/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   └── mongodb.py         # Async Motor MongoDB connection
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py            # User database model
│   │   │   ├── contract.py        # Contract database model
│   │   │   └── analysis.py        # Analysis database model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py            # Pydantic schemas for auth & JWT
│   │   │   ├── contract.py        # Upload schemas
│   │   │   └── analysis.py        # Structured AI finding & obligation schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── pdf_service.py     # PyMuPDF text & page extraction + validation
│   │   │   ├── ai_service.py      # Gemini API & 21-category smart heuristic engine
│   │   │   └── report_service.py  # ReportLab styled PDF report generator
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py            # /api/auth (register, login, me)
│   │   │   ├── contracts.py       # /api/contracts (upload PDF/text, sample loader)
│   │   │   ├── analysis.py        # /api/analysis (trigger AI, get, history, delete)
│   │   │   └── reports.py         # /api/reports/{id}/pdf (downloadable report)
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── security.py        # Bcrypt hashing & JWT utilities
│   │   └── main.py                # FastAPI app, lifespan, CORS, global handlers
│   ├── .env                       # Local environment variables
│   ├── .env.example               # Template environment configuration
│   ├── requirements.txt           # Python dependencies
│   └── create_sample_pdfs.py      # Script to generate demo contract PDFs
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Dark tech glowing header & navigation
│   │   │   ├── Footer.jsx         # Footer with disclaimer & project badges
│   │   │   ├── UploadBox.jsx      # Drag & drop PDF, file check & demo loader
│   │   │   ├── SummaryCard.jsx    # Executive AI summary & duration badge
│   │   │   ├── ObligationCard.jsx # Student Obligations 6-category dashboard
│   │   │   ├── FindingCard.jsx    # Comparative finding card with original clause
│   │   │   └── Loading.jsx        # Dynamic 4-stage progress animation
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page with hero & how-it-works
│   │   │   ├── Analyzer.jsx       # Contract upload & analysis orchestrator
│   │   │   ├── Results.jsx        # Complete interactive analysis dashboard
│   │   │   ├── History.jsx        # Stored MongoDB agreements & search
│   │   │   ├── About.jsx          # College project showcase & architecture
│   │   │   ├── Login.jsx          # User login
│   │   │   ├── Register.jsx       # Student registration
│   │   │   └── NotFound.jsx       # 404 error page
│   │   ├── services/
│   │   │   └── api.js             # Axios client, auth token interceptors
│   │   ├── App.jsx                # Router & layout
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Dark tech theme & electric violet styles
│   ├── package.json
│   └── vite.config.js             # Vite configuration with proxy to :8000
├── sample_agreements/
│   ├── Sample_Software_Internship_Agreement.pdf
│   └── Sample_Student_Hostel_PG_Agreement.pdf
├── run_backend.bat                # 1-click backend launcher
├── run_frontend.bat               # 1-click frontend launcher
├── start_all.bat                  # 1-click launcher for the entire stack
└── README.md
```

---

## ⚡ Quick Start / How to Run

### Method 1: Using the 1-Click Batch Script (Recommended for Windows)

Double-click `start_all.bat` in the project root:
```cmd
start_all.bat
```
This automatically launches the FastAPI backend in one terminal and the Vite development server in another!

---

### Method 2: Manual Step-by-Step Launch

#### 1. Start MongoDB
Ensure MongoDB is running locally on port 27017 (or configure `MONGODB_URL` in `backend/.env` for MongoDB Atlas).

#### 2. Start the Backend
Open a terminal in `backend/`:
```bash
# Activate Python Virtual Environment
..\venv\Scripts\activate

# Run FastAPI backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API is now running at: **http://127.0.0.1:8000**
Interactive API Swagger Docs: **http://127.0.0.1:8000/docs**

#### 3. Start the Frontend
Open a second terminal in `frontend/`:
```bash
npm run dev
```
Open your browser to: **http://localhost:5173**

---

## 🔑 Environment Configuration (`backend/.env`)

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=contract_ai_db
JWT_SECRET=supersecret_contract_ai_jwt_key_2026_secure
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# (Optional) Provide your Gemini or OpenAI API Key for live LLM extraction.
# If omitted, ContractAI automatically runs its intelligent 21-category heuristic engine!
GEMINI_API_KEY=
OPENAI_API_KEY=
PORT=8000
```

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new student account with hashed password |
| `POST` | `/api/auth/login` | Authenticate student and issue JWT Bearer token |
| `GET` | `/api/auth/me` | Retrieve profile of authenticated user |
| `POST` | `/api/contracts/upload` | Upload PDF file, extract text via PyMuPDF with page tracking |
| `POST` | `/api/contracts/upload-text` | Paste raw agreement clauses/text |
| `GET` | `/api/contracts/sample/{type}` | Retrieve demo internship or hostel agreement |
| `POST` | `/api/analysis/{contract_id}` | Trigger AI clause analysis & store results in MongoDB |
| `GET` | `/api/analysis/{analysis_id}` | Fetch structured analysis results |
| `GET` | `/api/analysis/history` | List previous analyses with pagination/sorting |
| `DELETE`| `/api/analysis/{analysis_id}` | Delete analysis from MongoDB |
| `GET` | `/api/reports/{analysis_id}/pdf` | Stream downloadable ReportLab PDF analysis report |

---

## 📄 Sample Test Documents Provided

To test without uploading personal documents, two realistic sample contracts are included in `sample_agreements/` and can be loaded directly from the UI:
1. **Sample_Software_Internship_Agreement.pdf**:
   - 6-month developer internship
   - ₹25,000 monthly stipend
   - 3-month mandatory lock-in period
   - 30-day notice period
   - ₹15,000 liquidated damages clause for early departure
   - IP ownership assignment & 6-month non-compete covenant
2. **Sample_Student_Hostel_PG_Agreement.pdf**:
   - 11-month academic year PG accommodation
   - ₹12,000 monthly rent + ₹24,000 security deposit
   - 4-month lock-in period
   - 45-day move-out notice
   - 10:00 PM curfew policy & electric appliance restrictions

---

## 🔮 Future Scope

- **Multi-language Translation**: Translate contract clauses into regional languages (Hindi, Spanish, French, etc.).
- **Voice Explanation**: Audio narration of critical obligations for visually impaired students.
- **Contract Comparison Tool**: Upload two competing internship offers to view side-by-side compensation, notice periods, and lock-ins.
- **University Career Portal Integration**: Direct integration with college placement offices.

---

## ⚖️ Legal Disclaimer

> **IMPORTANT**: ContractAI provides AI-generated explanations and clause extractions strictly for **educational and informational purposes only**. It does **not** constitute professional legal advice, formal representation, or guarantee legal validity. Always read agreements in full or consult a qualified legal professional before signing binding contracts.
