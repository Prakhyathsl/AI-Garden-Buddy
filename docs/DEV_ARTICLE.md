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

When urban and balcony gardeners turn to AI for advice, they typically encounter two big frustrations:

1. **Hallucinated or Generic Agricultural Advice:** Standard LLMs often recommend deep-root vegetables for shallow 6-inch balcony pots, suggest planting frost-sensitive varieties during humid coastal monsoons, or invent arbitrary chemical fertilizer dosages.
2. **The "Stay on Your Phone" Trap:** Most gardening applications try to maximize "session duration." They want you tapping through endless menus, chatting with a generic conversational bot, and browsing ads while your potted plants sit neglected outside.

Our vision was simple: **Grow smarter. Waste less. Get outside.**

---

## 2. The "Touch Grass" Theme: Outdoor Impact

AI should help people connect with the physical world, not substitute for it. 

We designed **AI Garden Buddy** from the ground up around the **"Touch Grass"** ethos:
- **30-Second Reads:** Each daily task is concise and actionable, designed to be read in under 30 seconds.
- **Daily Outdoor Screen-Free Missions:** Every scheduled day features a tactile, sensory challenge:
  - *Day 1:* Insert your bare finger 2 inches into the potting soil to test moisture depth.
  - *Day 2:* Pinch the purple flowering tops of Holy Basil (Tulsi) and crush a fresh mint leaf between your palms to breathe in the natural menthol aroma.
  - *Day 3:* Inspect under planter saucers, listen for urban bird songs, and look for pollinating bees.
- **Offline Consistency:** The user leaves their phone inside, steps out into the morning air, and gets their hands into real living soil.

---

## 3. Demonstration & Walkthrough

AI Garden Buddy is built around a realistic example location in **Mangalore, Coastal Karnataka, India** (with full support for any custom global location):

- **Space:** 40 sq ft east-facing balcony with 6 containers and 4 hours of morning sun.
- **Gardener Goals:** Fresh culinary herbs, morning tea leaves, and pollinator support.
- **Time Budget:** 20 minutes per day.

When you launch the planner:
1. **Live Meteorological Grounding:** The system calls the free Open-Meteo API to check actual temperature, humidity, and 7-day precipitation totals.
2. **Gemma 2 Synthesis:** Google's open-weight **Gemma 2** (`gemma2:9b` locally or `gemma2-9b-it`) synthesizes space, container depths, light, and climate.
3. **Structured Schedule:** The model returns a strictly validated 7-day schedule, companion planting advice (like pairing French Marigolds with tomatoes to deter pests), and explicit safety caveats.
4. **Plant Doctor:** If leaves turn yellow, the Gemma-powered Health Assistant evaluates symptoms, calculates ranked causes (e.g. overwatering vs. nitrogen leach), and provides non-toxic physical checks.

---

## 4. Architecture: How Gemma is Used

AI Garden Buddy uses a clean monorepo architecture:

```
ai-garden-buddy/
├── frontend/             # Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide
├── backend/              # Python FastAPI, Pydantic v2 schemas, Open-Meteo integration
│   ├── app/services/
│   │   ├── gemma_provider.py    # Resilient multi-backend Gemma engine
│   │   ├── prompt_builder.py    # Structured horticultural prompt engineer
│   │   ├── weather_service.py   # Live Open-Meteo geocoding & forecast
│   │   └── plant_database.py    # Curated botanical seed database (ICAR/RHS)
│   └── tests/                   # 12 automated pytest test suites
└── docs/                        # Architecture, benchmarks, and API guides
```

### Why Gemma 2 is Central
Gemma 2 is not an afterthought or an optional add-on—it is the central reasoning core:
- **Spatial Reasoning:** Gemma calculates whether 6 pots can accommodate both bushy basil and vining tomatoes without root competition.
- **Time Enforcement:** Gemma guarantees that daily tasks strictly fit inside the user's daily minute budget.
- **Schema Adherence:** Gemma outputs RFC-compliant JSON adhering to our typed `GardenPlan` and `HealthAssessmentResponse` models.

---

## 5. Why Open-Weight AI Matters

Most proprietary AI models treat user living spaces as data sources to train future commercial models. With open-weight AI:

1. **True Data Sovereignty:** Balcony dimensions, personal schedules, and home garden habits remain completely private.
2. **Auditable & Non-Toxic Safety:** We can inspect prompt templates to ensure the AI never recommends hazardous chemical pesticides to home gardeners.
3. **Hardware Freedom:** Anyone can run `gemma2:2b` on a modest laptop, `gemma2:9b` on a desktop GPU, or deploy `gemma2:27b` on their own server.
4. **No Artificial Blackouts:** If an external commercial API goes down or changes terms, your local garden planner keeps running.

---

## 6. Local Inference & Privacy

We built a transparent provider abstraction in `app/services/gemma_provider.py`:
- **Local Ollama Integration (Preferred):** Connects to `http://localhost:11434`. Zero tokens leave the machine.
- **Cloud Fallbacks:** Supports explicitly configured Gemma providers (Groq, OpenRouter, HuggingFace) when running in resource-constrained hosted environments.
- **Honest Mode Indicators:** The UI explicitly displays the active model identifier and inference mode badge (e.g., `Gemma 2 (Local Ollama)` vs `Gemma 2 (Groq Cloud)` vs `Gemma Demo Mode`). We never pretend a cloud API is running locally.

---

## 7. A Real Implementation Challenge: Reliable Structured JSON

A major challenge with small and medium open-weight LLMs is preventing them from outputting conversational chatter before the JSON or wrapping responses in uneven markdown fences.

### How We Solved It:
1. **Systemic Prompt Framing:** We provided strict typescript-like JSON schemas with explicit dummy example types in the prompt.
2. **Regex Pipeline:** We wrote a robust multi-pass JSON extractor (`clean_json_response`) that strips `<think>` tokens, regex-matches markdown code blocks, and isolates `{ ... }`.
3. **Pydantic Validation Guard:** Before any plan is returned, Pydantic v2 validates all types, ensures `weekly_tasks` contains 7 distinct daily missions, and guarantees all times are within range.
4. **Graceful Error Handling:** If the model returns malformed JSON or times out, the backend returns an honest HTTP 422/503 with exact troubleshooting steps, rather than fabricating a false plan.

---

## 8. Testing Methodology & Honest Results

We implemented automated testing across backend schemas and frontend builds:
- **12 Automated Pytest Tests:**
  - Health check endpoint & provider detection
  - Garden profile schema validation & boundaries
  - Demo fixture plan generation
  - Model timeout & model unavailable failure paths
  - Malformed model output handling
  - Curated plant library search and filters
  - Safe weather fallback handling
- **Result:** `12 passed in 23.38s (100% pass rate)`
- **Next.js Production Build:** `13/13 pages compiled cleanly with 0 type errors`

---

## 9. What We Learned

1. **Gemma 2 9B is Exceptionally Good at Spatial Logic:** When given container dimensions and pot counts, Gemma 2 showed surprisingly nuanced horticultural restraint, consistently advising against invasive mint roots sharing pots with tomatoes.
2. **Grounding Prevents Hallucinations:** Feeding live weather readings (rainfall, temperature) directly into Gemma's context transformed generic gardening tips into sharp, actionable advice.
3. **Open-Source UX Should Inspire Action:** Software should empower users to do things in the physical world. Building the "Touch Grass" missions was the most rewarding part of this challenge.

---

## 10. How to Run AI Garden Buddy

### Quickstart (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/Prakhyathsl/Plantcare-ai.git
cd Plantcare-ai

# 2. Set up Backend
python -m venv .venv
.\.venv\Scripts\activate   # or source .venv/bin/activate
pip install -r backend/requirements.txt
python backend/run.py      # Starts on http://127.0.0.1:8000

# 3. Set up Frontend (in another terminal)
cd frontend
npm install
npm run dev                # Starts on http://localhost:3000

# 4. Optional: Run Local Gemma with Ollama
ollama pull gemma2:9b
ollama serve
```

---

## 11. Links & Submission Materials

- **GitHub Repository:** [https://github.com/Prakhyathsl/Plantcare-ai](https://github.com/Prakhyathsl/Plantcare-ai)
- **License:** MIT License
- **Target Category:** Best Use of Gemma (Week 1 Hacktoberfest 2026)

*Now go step outside, feel the soil, and touch some grass!* 🌿
