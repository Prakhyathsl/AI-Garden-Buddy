# AI Garden Buddy 🌿

> **Grow smarter. Waste less. Get outside.**
> 
> A practical, privacy-conscious garden planning companion powered by Google's open-weight **Gemma 2** model.
> Built for the **Hacktoberfest 2026 Open-Source AI Challenge (Week 1)** — targeting the **Best Use of Gemma** partner category.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2026%20Week%201-orange.svg)](#hacktoberfest-2026-week-1)
[![Model](https://img.shields.io/badge/Model-Google%20Gemma%202%20(Open%20Weights)-blue.svg)](https://ai.google.dev/gemma)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Pydantic%20v2-green.svg)](backend/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016%20%7C%20Tailwind%20CSS-teal.svg)](frontend/)
[![Tests](https://img.shields.io/badge/Tests-22%20Passing%20(100%25)-brightgreen.svg)](backend/tests/)

---

## 📖 Product Vision & The "Touch Grass" Theme

Most plant care apps trap users in lengthy chat loops, endless photo uploads, and invasive advertising while their plants sit neglected outside.

**AI Garden Buddy** does the opposite:
- **30-Second Micro-Tasks:** Read today's task in 30 seconds, then put your phone away.
- **Daily Screen-Free Missions:** Every day features a sensory "Touch Grass" outdoor activity (checking soil moisture 2 inches down, rubbing fragrant mint leaves, inspecting leaf undersides for aphids, listening for pollinators).
- **Context-Aware Spatial Logic:** Gemma 2 reasons over your exact container count, soil depth, sunlight exposure, and daily minute budget before proposing a single seed.
- **100% Private Local Inference:** Runs on your own machine using [Ollama](https://ollama.com/) with zero tracking or telemetry.

---

## 🌟 Key Features

1. **AI Weekly Garden Planner (Core Gemma Feature):**
   - Synthesizes space constraints, container depths, and live Open-Meteo meteorological data.
   - Generates an actionable 7-day task schedule, companion recommendations, and outdoor missions.
   - Strictly enforces daily time budgets and non-toxic horticultural practices.

2. **Plant Health Diagnostic Assistant:**
   - Evaluates observed leaf discoloration, wilting, or pest symptoms.
   - Returns cautiously ranked causes, distinguishing diagnostic questions, and safe non-toxic physical checks.
   - Zero hallucinated vision claims: textual reasoning grounded in botanical science.

3. **Curated Botanical Library & Garden Collection:**
   - Searchable, filterable seed database (Herbs, Vegetables, Flowers, Container-Friendly, Sunlight, Difficulty).
   - Grounded in verified ICAR and RHS agricultural standards.
   - Add/remove plants from your active garden collection.

4. **Task Calendar & Outdoor Streak Tracker:**
   - Check off daily garden activities and track your screen-free outdoor minutes.
   - Maintains consistency streaks to encourage regular outdoor connection.

5. **Sustainability Guide & Garden Journal:**
   - Log visual observations, watering events, and harvest milestones.
   - Practical urban conservation guides (root-zone watering, vermicomposting, container upcycling).

6. **"Why Open AI?" Transparency Engine:**
   - Displays active model identifier and inference mode in real time.
   - Documented 3-scenario reproducible experiment comparing balconies, terraces, and indoor ledges.

---

## 🏛️ System Architecture

```
ai-garden-buddy/
├── frontend/             # Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide
│   ├── src/app/          # 10 application pages (Landing, Dashboard, Planner, etc.)
│   ├── src/components/   # Navbar, Footer, Badges
│   └── src/lib/          # API client, LocalStorage persistence, Demo fixtures
├── backend/              # Python FastAPI, Pydantic v2 schemas
│   ├── app/routes/       # /api/health, /api/garden/plan, /api/garden/diagnose, /api/plants
│   ├── app/services/     # GemmaProvider, PromptBuilder, WeatherService, PlantDatabase
│   ├── app/models/       # Strictly typed Pydantic request/response models
│   └── tests/            # 12 automated unit tests (100% pass rate)
├── docs/                 # Architecture, Gemma experiment report, DEV submission article
├── .github/workflows/    # Continuous Integration (pytest + next build)
├── README.md
├── LICENSE               # MIT License
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── .env.example
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18+ or v20+) and npm
- Python (v3.10+)
- Git
- *(Optional for local AI)* [Ollama](https://ollama.com/)

---

### Step 1: Clone Repository
```bash
git clone https://github.com/Prakhyathsl/Plantcare-ai.git
cd Plantcare-ai
```

---

### Step 2: Start the FastAPI Backend
```bash
# Create virtual environment
python -m venv .venv

# Activate environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1
# (On macOS/Linux: source .venv/bin/activate)

# Install dependencies
pip install -r backend/requirements.txt

# Start backend server
python backend/run.py
```
*Backend runs at `http://127.0.0.1:8000`. Interactive Swagger docs available at `http://127.0.0.1:8000/docs`.*

---

### Step 3: Start the Next.js Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:3000`.*

---

### Step 4: Configure Gemma 2 Inference

AI Garden Buddy supports three inference modes:

#### Option A: Local Ollama (Recommended & 100% Private)
1. Install [Ollama](https://ollama.com/).
2. Pull the official Google Gemma 2 model:
   ```bash
   ollama pull gemma2:9b
   ollama serve
   ```
   The backend automatically discovers Ollama on `http://localhost:11434` and displays `Gemma 2 (Local Ollama)` in the UI.

#### Option B: Google AI Studio (Official Hosted Gemma)
Copy `.env.example` to `.env` in the project root and configure your Google AI Studio key:
```env
GEMMA_BACKEND=auto
GEMINI_API_KEY=your_google_ai_studio_api_key_here
GEMINI_MODEL=gemma-4-26b-a4b-it
```
When `GEMINI_API_KEY` is present and Ollama is not running, the application automatically routes to Google AI Studio's Gemma endpoint (`https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent`) using the `x-goog-api-key` header.

#### Option C: Alternative Cloud Gemma APIs (Groq / OpenRouter / HuggingFace)
Configure `GROQ_API_KEY`, `OPENROUTER_API_KEY`, or `HUGGINGFACE_API_KEY` in `.env`.

#### Option D: Instant Demo Fixture Mode
No GPU or API key? Check the **"Use Verified Sample Demo Data"** box in the UI to instantly test and evaluate all features using verified reference fixtures.

---

## 🧪 Automated Testing

### Backend Test Suite (Pytest)
```bash
.\.venv\Scripts\pytest.exe backend/tests -v
```
**Results:** `22 passed in 30.08s (100% pass rate)`
- Validates root and health checks
- Validates garden profile schema constraints
- Validates 7-day plan structure and outdoor mission generation
- Validates model unavailable, timeout (504), and malformed output (422) error handling
- Validates plant health diagnostic assistant and error states
- Validates plant library search and filtering
- Validates safe meteorological fallbacks

### Frontend Production Build
```bash
cd frontend
npm run build
```
**Results:** `13/13 static routes compiled with 0 type errors.`

---

## 🔒 Security & Privacy

- **Zero Telemetry:** No user garden layouts or notes leave your machine.
- **Client-Side Persistence:** Garden profiles, task checkmarks, and journal entries are stored exclusively in your browser's `localStorage`.
- **Server-Side Secrets:** API keys are never exposed to the client bundle.
- **Non-Toxic Guardrails:** AI prompts forbid dangerous pesticide recommendations or hazardous chemical dosages.

---

## 🤝 Contributing

We welcome contributions during Hacktoberfest 2026! See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, coding guidelines, and PR procedures.

Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Gemma weights are governed by Google's [Gemma Terms of Use](https://ai.google.dev/gemma/terms).