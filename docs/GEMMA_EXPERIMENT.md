# Reproducible Gemma 2 Evaluation Experiment

This document details the reproducible evaluation conducted with Google's open-weight **Gemma 2** (`gemma2:9b` / `gemma2-9b-it`) across three distinct gardening scenarios.

## 1. Methodology & Test Harness

- **Model Evaluated:** Google Gemma 2 9B Instruct (`gemma2:9b` via Ollama and `gemma2-9b-it` via API).
- **Temperature:** `0.2` (for deterministic, structured adherence).
- **Format:** Strict JSON schema conforming to `GardenPlan`.
- **Validation:** Pydantic v2 runtime parsing.

## 2. Tested Scenarios

### Scenario 1: Coastal Sunny Balcony
- **Location:** Mangalore, Coastal Karnataka, India
- **Space:** 40 sq ft, 6 containers
- **Sunlight:** Partial sun (4-5 hrs morning light)
- **Time Budget:** 20 mins / day
- **Gardener Level:** Beginner
- **Stated Preferences:** Tulsi, Mint, Cherry Tomatoes, Chillies
- **Meteorological Context:** Warm maritime air, high humidity (78%), 29°C

#### Results & Observations:
- **Output Schema Validity:** 100% valid JSON matching `GardenPlan` schema.
- **Recommended Plants:** Holy Basil (Tulsi), Spearmint (Pudina in dedicated pot), French Marigold (companion), Cherry Tomato.
- **Space Logic:** Explicitly advised growing Mint in a separate pot to prevent runner takeover. Noted 10-inch minimum depth for Tulsi.
- **Time Adherence:** Tasks generated ranged from 15 to 20 minutes (never exceeded the 20-minute daily budget).
- **Outdoor Missions:** Sensory tasks included finger soil depth moisture testing, mint leaf rubbing for aroma, and morning balcony breathing.

---

### Scenario 2: Partially Shaded Terrace
- **Location:** Bangalore, Karnataka, India
- **Space:** 120 sq ft, 14 containers
- **Sunlight:** Partial shade / dappled light (3-4 hrs)
- **Time Budget:** 30 mins / day
- **Gardener Level:** Intermediate
- **Stated Preferences:** Mixed greens, culinary herbs, pollinator flowers
- **Meteorological Context:** 24°C, moderate wind on rooftop

#### Results & Observations:
- **Output Schema Validity:** 100% valid JSON matching `GardenPlan` schema.
- **Recommended Plants:** Malabar Spinach (Basale Soppu) on trellis, Fenugreek (Methi), Spearmint, Lemongrass.
- **Space Logic:** Recommended trellis placement along the wind-protected wall to prevent drying winds from snapping tender climbing vines.
- **Time Adherence:** Tasks ranged from 20 to 25 minutes, adhering strictly to the 30-minute daily allowance.
- **Outdoor Missions:** Included evening bee observation, organic vermicompost top-dressing, and vine guidance along twine.

---

### Scenario 3: Compact Indoor Windowsill Ledge
- **Location:** Mumbai, Maharashtra, India
- **Space:** 12 sq ft, 3 containers
- **Sunlight:** Bright indirect light / windowsill (2 hrs)
- **Time Budget:** 10 mins / day
- **Gardener Level:** Beginner
- **Stated Preferences:** Tea herbs, microgreens
- **Meteorological Context:** Indoor ambient, 27°C

#### Results & Observations:
- **Output Schema Validity:** 100% valid JSON matching `GardenPlan` schema.
- **Recommended Plants:** Fenugreek Microgreens (shallow tray), Mint stem cuttings, Coriander.
- **Space Logic:** Did NOT recommend high-sun, deep-root fruiting crops like tomatoes or chillies, correctly identifying that 2 hours of window light is insufficient for fruit set.
- **Time Adherence:** All tasks strictly estimated at 8-10 minutes.
- **Outdoor Missions:** Sensory window misting, checking surface condensation, and harvesting fresh microgreens for cooking.

## 3. Conclusions

1. **Structured Output Reliability:** Gemma 2 demonstrates outstanding zero-shot compliance with nested JSON schemas when guided by clear system definitions.
2. **Context Sensitivity:** The model consistently respects negative constraints (e.g. not planting deep taproots in 6-inch troughs or sun-hungry nightshades in shaded windows).
3. **Screen-Free Outdoor Prompts:** The model successfully generated tactile, mindful tasks that promote real outdoor gardening rather than screen interaction.
