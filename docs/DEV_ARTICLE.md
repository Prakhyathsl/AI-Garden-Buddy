---
title: "AI Garden Buddy: A Garden Planner Powered by Open-Weight Gemma"
published: false
description: "Grow smarter. Waste less. Get outside. A privacy-first gardening companion powered by Google's open-weight Gemma 2 model, connecting people with living plants."
tags: "devchallenge, hf26challenge, gemma, ai, opensource, webdev"
cover_image: ""
canonical_url: ""
---

# AI Garden Buddy: A Garden Planner Powered by Open-Weight Gemma

> *Submitted to the Hacktoberfest 2026 Open-Source AI Challenge (Week 1) — Targeting the **Best Use of Gemma** Partner Category.*
> 
> **Tags:** `#devchallenge` `#hf26challenge`

---

## 1. The Problem: Generic Chatbots and Indoor Screen Traps

When urban and balcony gardeners turn to AI for guidance, they typically encounter two big frustrations:

1. **Agricultural Hallucinations & Flawed Spatial Math:** Standard commercial LLMs frequently recommend deep-root taproot crops for shallow 6-inch balcony pots, suggest planting frost-sensitive varieties during humid tropical monsoons, or invent arbitrary chemical pesticide dosages.
2. **The "Stay on Your Phone" Trap:** Most gardening apps attempt to maximize user screen engagement. They trap users in lengthy chat sessions, endless photo uploads, and notifications while living plants outside suffer from neglected soil moisture or poor drainage.

Our guiding principle is simple: **Grow smarter. Waste less. Get outside.**

---

## 2. The "Touch Grass" Theme: Real Outdoor Impact

AI should inspire people to connect with the physical world, not substitute for it. 

We engineered **AI Garden Buddy** from the ground up around the **"Touch Grass"** ethos:
- **30-Second Reads:** Each daily task is actionable and designed to be digested in under 30 seconds.
- **Daily Outdoor Screen-Free Missions:** Every scheduled day features a tactile, sensory challenge:
  - *Day 1:* Insert your bare finger 2 inches into the potting soil to test moisture depth.
  - *Day 2:* Pinch the purple flowering tops of Holy Basil (Tulsi) and crush a fresh mint leaf between your palms to breathe in the natural menthol aroma.
  - *Day 3:* Inspect under planter saucers, listen for urban bird songs, and look for pollinating bees.
  - *Day 4:* Check foliage undersides for aphids and wipe dusty leaves with a damp cloth.
  - *Day 5:* Dilute organic vermicompost tea into root zones.
  - *Day 6:* Tie vining tomato stems to bamboo stakes and stretch in the weekend morning sun.
  - *Day 7:* Harvest fresh herbs for afternoon tea and reflect on weekly plant growth.
- **Offline Consistency:** The user reads the prompt, leaves their phone inside, and gets their hands into real living soil.

---

## 3. How Google's Gemma 2 Powers the Application

Google's open-weight **Gemma 2** (`gemma2:9b` locally or `gemma2-9b-it`) is the central reasoning engine powering two core features:

### A. The Weekly Garden Planner (`/api/garden/plan`)
- **Spatial Reasoning:** Gemma calculates whether container volumes and counts can support proposed species without root entanglement or light competition.
- **Time Bounding:** Gemma strictly bounds every daily activity within the user's declared daily minute budget (e.g. 15 or 20 minutes).
- **Meteorological Context:** Before Gemma infers, the backend fetches live temperature, humidity, and 7-day precipitation totals from the free **Open-Meteo API** (CC-BY 4.0), passing live meteorological readings directly into Gemma's context.
- **Schema Compliance:** The model outputs RFC-compliant JSON strictly validated at runtime by **Pydantic v2** (`GardenPlan`).

### B. The Plant Health Assistant (`/api/garden/diagnose`)
- **Cautious Symptom Analysis:** Evaluates observed symptoms (chlorosis, necrosis, drooping) alongside watering routine and sunlight.
- **Ranked Causes:** Ranks probable causes (e.g., overwatering vs. nitrogen leach) with transparent likelihoods.
- **Zero Hallucinated Vision Claims:** We deliberately avoid unreliable computer vision hacks. Gemma performs deep structured textual reasoning over observed symptoms and provides physical diagnostic checks (e.g. 2-inch finger test, drainage hole inspection).
- **Safety First:** Strict guardrails prevent the recommendation of synthetic poisons or hazardous chemical dosages.

---

## 4. Architecture & System Design

```
Plantcare-ai/
├── frontend/             # Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide
│   ├── src/app/          # 10 pages: Landing, Dashboard, Profile, Planner, Plants, Tasks, Health, Journal, Why Open AI, About
│   ├── src/components/   # Navbar, Footer, Live Gemma Engine Badge
│   └── src/lib/          # API client, LocalStorage persistence, Verified demo fixtures
├── backend/              # Python FastAPI, Pydantic v2 schemas
│   ├── app/routes/       # /api/health, /api/garden/plan, /api/garden/diagnose, /api/plants, /api/weather
│   ├── app/services/     # GemmaProvider, PromptBuilder, WeatherService, PlantDatabase
│   ├── app/models/       # Typed Pydantic request & response schemas
│   └── tests/            # 17 automated pytest test suites
└── docs/                 # Architecture, benchmarks, and API guides
```

### Multi-Provider Gemma Abstraction
The backend implements a multi-provider client (`GemmaProvider`) supporting:
1. **Local Ollama (Preferred & 100% Private):** Directly interfaces with `http://localhost:11434/api/generate` with `model: "gemma2:9b"`.
2. **Google AI Studio API:** Connects with `gemma-2-27b-it` via official Google AI Studio endpoints when `GEMINI_API_KEY` is provided.
3. **Groq Cloud API:** High-speed `gemma2-9b-it` inference when `GROQ_API_KEY` is provided.
4. **Hugging Face / OpenRouter:** Compatible with `google/gemma-2-9b-it`.
5. **Verified Demo Fixture Mode:** Clearly labeled reference data for testing without launching an inference server.

*Rule of Transparency:* The application dynamically reports the active model and inference mode in the header badge (`Gemma 2 (Local Ollama)` vs `Gemma 2 (Groq Cloud)` vs `Gemma Demo Mode`). It **never** fabricates a successful response when a model fails.

---

## 5. Why Open-Weight AI Matters for Gardeners

1. **Complete Data Sovereignty:** Balcony floor plans, home coordinates, and daily schedules never leave the user's hardware.
2. **Auditable Non-Toxic Safety:** We can inspect system prompts to guarantee hazardous pesticide recommendations are prohibited.
3. **Hardware Independence:** Users can run `gemma2:2b` on low-power laptops, `gemma2:9b` on consumer GPUs, or run `gemma2:27b` without proprietary subscription lock-in.
4. **Offline Resilience:** If cloud APIs suffer outages or rate limits, local Gemma inference continues functioning in off-grid or rural areas.

---

## 6. Reproducible Gemma 2 Experiment (3 Scenarios)

We evaluated Google's open-weight Gemma 2 model across three distinct gardening environments:

| Scenario | Constraints | Gemma Recommended Species | Time Adherence | Schema Validity |
|---|---|---|---|---|
| **1. Coastal Balcony** | 40 sq ft, 6 pots, 4 hrs morning sun, 78% humidity (Mangalore, India) | Tulsi, Pudina (isolated pot), Cherry Tomato, French Marigold | 15–20 mins / day (budget: 20m) | 100% Valid JSON |
| **2. Shaded Terrace** | 120 sq ft, 14 pots, 3-4 hrs dappled sun, windy (Bangalore, India) | Malabar Spinach (trellis), Fenugreek Greens, Spearmint, Lemongrass | 20–25 mins / day (budget: 30m) | 100% Valid JSON |
| **3. Indoor Windowsill** | 12 sq ft, 3 pots, 2 hrs indirect light, beginner (Mumbai, India) | Fenugreek Microgreens, Mint cuttings, Coriander | 8–10 mins / day (budget: 10m) | 100% Valid JSON |

### Empirical Takeaway
Gemma 2 showed remarkable spatial restraint: it consistently refused to plant deep-root nightshades in shaded windows, and explicitly cautioned against planting spreading mint runners in the same container as slower companion herbs.

---

## 7. Implementation Challenge: Reliable Structured JSON

A key challenge with open-weight models is preventing conversational filler (e.g. *"Here is your garden plan:"*) or markdown code fences from corrupting JSON parsers.

### How We Solved It:
1. **Schema-Constrained System Prompts:** Structured TypeScript-like interfaces directly embedded in the system prompt.
2. **Multi-Pass Regex Cleaner:** An automated cleaner (`clean_json_response`) strips `<think>` tokens, regex-matches markdown code blocks, and isolates `{ ... }`.
3. **Pydantic Validation Guard:** Runtime validation enforces that `weekly_tasks` contains exactly 7 days, each task has an `outdoor_mission`, and durations are bounded.
4. **Honest Error Propagation:** If an inference times out or fails parsing, the backend returns an honest HTTP 422/504 error with actionable recovery advice rather than silently serving mock data.

---

## 8. Verified Testing & Build Results

All tests have been run and verified:

```text
backend/tests/test_diagnose.py::test_diagnose_demo_fixture PASSED        [  5%]
backend/tests/test_diagnose.py::test_diagnose_model_unavailable PASSED   [ 11%]
backend/tests/test_diagnose.py::test_diagnose_model_timeout PASSED       [ 17%]
backend/tests/test_diagnose.py::test_diagnose_malformed_output PASSED    [ 23%]
backend/tests/test_health.py::test_root_endpoint PASSED                  [ 29%]
backend/tests/test_health.py::test_health_endpoint PASSED                [ 35%]
backend/tests/test_plan.py::test_demo_fixture_plan_generation PASSED     [ 41%]
backend/tests/test_plan.py::test_model_unavailable_error PASSED          [ 47%]
backend/tests/test_plan.py::test_malformed_model_output_error PASSED     [ 52%]
backend/tests/test_plan.py::test_model_timeout_error PASSED              [ 58%]
backend/tests/test_plants.py::test_get_all_plants PASSED                 [ 64%]
backend/tests/test_plants.py::test_search_and_filter_plants PASSED       [ 70%]
backend/tests/test_plants.py::test_plant_detail_not_found PASSED         [ 76%]
backend/tests/test_validation.py::test_invalid_garden_profile_missing_fields PASSED [ 82%]
backend/tests/test_validation.py::test_invalid_time_budget PASSED        [ 88%]
backend/tests/test_validation.py::test_invalid_health_request_empty_symptoms PASSED [ 94%]
backend/tests/test_weather.py::test_weather_endpoint_safe_response PASSED [100%]

============================= 17 passed in 29.54s =============================
```

- **Backend Pytest Suite:** **17/17 tests passing (100% pass rate)**.
- **Frontend Production Build:** **13/13 static routes compiled cleanly with 0 TypeScript/ESLint errors**.
- **Live Weather Integration:** Verified against Open-Meteo geocoding and forecast endpoints.

---

## 9. How to Run AI Garden Buddy Locally

```bash
# 1. Clone the repository
git clone https://github.com/Prakhyathsl/Plantcare-ai.git
cd Plantcare-ai

# 2. Set up and start Backend
python -m venv .venv
.\.venv\Scripts\activate   # (or source .venv/bin/activate on macOS/Linux)
pip install -r backend/requirements.txt
python backend/run.py      # Starts on http://127.0.0.1:8000

# 3. Set up and start Frontend (in another terminal)
cd frontend
npm install
npm run dev                # Starts on http://localhost:3000

# 4. Optional: Run Gemma 2 locally with Ollama
ollama pull gemma2:9b
ollama serve
```

---

## 10. Links & Submission Details

- **GitHub Repository:** [https://github.com/Prakhyathsl/Plantcare-ai](https://github.com/Prakhyathsl/Plantcare-ai)
- **License:** MIT License
- **Target Category:** Best Use of Gemma (Week 1 Hacktoberfest 2026)

*Now put your phone away, step outside, and touch some grass!* 🌿
