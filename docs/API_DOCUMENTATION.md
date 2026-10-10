# AI Garden Buddy — REST API Documentation

The backend exposes interactive Swagger documentation at `/docs` and OpenAPI JSON at `/openapi.json`.

Base URL: `http://127.0.0.1:8000`

---

### 1. Health & AI Engine Status
- **Method:** `GET`
- **Path:** `/api/health`
- **Description:** Returns backend health, active Gemma model, inference mode (`ollama_local`, `groq_api`, `openrouter_api`, `demo_mode`), Ollama reachability, and privacy notice.

**Response Example:**
```json
{
  "status": "healthy",
  "app_name": "AI Garden Buddy API",
  "app_version": "1.0.0",
  "ai_engine": {
    "model_family": "Google Gemma Open-Weights",
    "active_model": "gemma2:9b",
    "inference_mode": "ollama_local",
    "is_local": true,
    "ollama_server_reachable": true,
    "installed_ollama_models": ["gemma2:9b"]
  }
}
```

---

### 2. Generate Garden Plan
- **Method:** `POST`
- **Path:** `/api/garden/plan`
- **Description:** Synthesizes garden profile constraints, live Open-Meteo weather, and Gemma reasoning into a validated 7-day schedule with outdoor missions.

**Request Body Example:**
```json
{
  "profile": {
    "garden_name": "Mangalore Coastal Balcony",
    "location": "Mangalore, Coastal Karnataka, India",
    "country": "India",
    "garden_type": "balcony",
    "space_sq_ft": 40.0,
    "containers_count": 6,
    "sunlight_exposure": "partial_sun",
    "soil_medium": "potting_mix",
    "water_availability": "moderate",
    "experience_level": "beginner",
    "preferred_plants": ["Holy Basil (Tulsi)", "Mint (Pudina)"],
    "gardening_goals": ["Fresh herbs", "Pollinator support"],
    "time_budget_mins_per_day": 20
  },
  "planning_period": "This Week",
  "custom_focus": "seedling care",
  "use_sample_data": false
}
```

---

### 3. Plant Library Search & Filters
- **Method:** `GET`
- **Path:** `/api/plants`
- **Query Parameters:**
  - `query` (string, optional)
  - `category` (string: "Herb", "Vegetable", "Flower")
  - `container_only` (boolean, optional)
  - `difficulty` (string: "Easy", "Moderate", "Challenging")
  - `sunlight` (string, optional)

---

### 4. Plant Health Diagnostic Assistant
- **Method:** `POST`
- **Path:** `/api/garden/diagnose`
- **Description:** Evaluates observed plant symptoms, water habits, and light to generate cautious ranked causes, distinguishing questions, and safe non-toxic check steps.

---

### 5. Weather & Seasonal Sensor
- **Method:** `GET`
- **Path:** `/api/weather`
- **Query Parameters:**
  - `location` (string, e.g. "Mangalore, India")
- **Description:** Geocodes location and fetches live Open-Meteo temperature, relative humidity, and 7-day precipitation totals.
