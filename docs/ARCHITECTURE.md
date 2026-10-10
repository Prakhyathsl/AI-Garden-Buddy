# AI Garden Buddy — Architecture & System Design

## 1. System Overview

AI Garden Buddy is a full-stack, open-source gardening assistant created for **Hacktoberfest 2026 Week 1 (Open-Source AI Challenge)**, targeting the **Best Use of Gemma** partner category.

The platform pairs Google's open-weight **Gemma 2** reasoning models with verified horticultural science and live meteorological data to create structured, constraint-abiding 7-day garden schedules with outdoor sensory missions.

```
+-------------------------------------------------------------------------+
|                           USER BROWSER                                  |
|  Next.js 16 (App Router) + Tailwind CSS + Lucide React + localStorage   |
+-------------------------------------------------------------------------+
                                    |
                    REST APIs (JSON over HTTP)
                                    v
+-------------------------------------------------------------------------+
|                       FASTAPI BACKEND SERVER                            |
|                                                                         |
|  [ Routes ]           [ Domain Services ]         [ External Sources ]  |
|  - /api/health        - PromptBuilder             - Open-Meteo Weather  |
|  - /api/garden/plan   - PlantDatabase (ICAR/RHS)    (Geocoding/Forecast)|
|  - /api/garden/diag   - GemmaProvider abstraction                       |
|  - /api/plants        - Pydantic v2 Validators                          |
+-------------------------------------------------------------------------+
                                    |
                    Inference Request (Strict JSON)
                                    v
+-------------------------------------------------------------------------+
|                     GOOGLE GEMMA 2 INFERENCE                            |
|                                                                         |
|  Primary: Local Ollama (http://localhost:11434, gemma2:9b)              |
|  Cloud:   Groq / OpenRouter / HuggingFace (gemma2-9b-it)                |
|  Demo:    Verified local fixtures (labeled transparently)               |
+-------------------------------------------------------------------------+
```

## 2. Core Architectural Principles

### 2.1 The "Touch Grass" Engine
Unlike conversational chatbots that keep the gardener staring at a screen, AI Garden Buddy's goal is to minimize screen time:
1. The user inputs space constraints and daily minutes.
2. Gemma generates a 7-day schedule with concise tasks.
3. Every single task features a dedicated screen-free **Outdoor Mission** (e.g. &ldquo;Check soil moisture 2 inches down with bare finger&rdquo;, &ldquo;Pinch Tulsi flower buds and smell fresh menthol and eugenol oils&rdquo;).
4. The user puts the phone away and gardens outdoors.

### 2.2 Transparent Gemma Inference Pipeline
The backend uses a resilient multi-provider abstraction (`GemmaProvider`):
- **Ollama Probe:** Automatically queries `http://localhost:11434/api/tags` to detect installed Gemma models.
- **Strict JSON Enforcement:** Prompts require RFC-compliant JSON adhering to the `GardenPlan` or `HealthAssessmentResponse` schema.
- **Markdown Stripping & Parsing:** Robust regex cleans any markdown fences (` ```json `), think tags, or commentary.
- **Pydantic Validation:** The output is rigorously parsed and validated by Pydantic before reaching the frontend.
- **Zero Hallucinated Success:** If the model fails or times out, the backend returns an honest HTTP 503 or 422 with actionable troubleshooting instructions. It never silently substitutes mock data as real AI output.

### 2.3 Curated Botanical Grounding vs. AI Generation
To prevent agricultural hallucinations:
- **Verified Seed Library:** Curated botanical facts (common name, scientific name, container depth, pH, companions, toxicity) are seeded from ICAR and RHS literature in `app/services/plant_database.py`.
- **Live Weather Sensor:** `Open-Meteo` provides real-time precipitation, humidity, and temperature data without requiring API keys.
- **Gemma's Role:** Gemma acts as the contextual synthesizer, connecting the space constraints, weather conditions, and botanical facts into an actionable routine.

## 3. Data Flow & Privacy

```
User Garden Constraints
        |
        v
+-----------------------+     Open-Meteo API
| FastAPI Backend       | <------------------ Live weather & rainfall
+-----------------------+
        |
        | Construct Contextual Prompt
        v
+-----------------------+
| Local Ollama Daemon   |  <-- Entirely on localhost (No telemetry)
| (Gemma 2 9B)          |
+-----------------------+
        |
        | Strict Structured JSON
        v
+-----------------------+
| Pydantic v2 Validator |  <-- Validates schema & outdoor missions
+-----------------------+
        |
        v
Next.js Client (Persisted in LocalStorage)
```
