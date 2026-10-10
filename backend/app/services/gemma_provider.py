"""Gemma Inference Provider.
Supports Google's open-weight Gemma model via:
1. Local Ollama (preferred local inference)
2. Groq (gemma2-9b-it)
3. OpenRouter (google/gemma-2-9b-it)
4. HuggingFace Inference API
5. Generic OpenAI-compatible Gemma endpoint (vLLM, llama.cpp, LocalAI)
6. Clearly labeled Offline Demo Mode for testing and UI evaluation.

Never misrepresents inference mode: always accurately reports model_id and inference_mode.
Never silently replaces failed inference with mock data.
"""

import json
import re
import datetime
from typing import Dict, Any, Tuple, Optional
import httpx

from app.config import settings


def clean_json_response(raw_text: str) -> str:
    """Strips markdown code blocks, think blocks, and extraneous text to isolate valid JSON."""
    text = raw_text.strip()
    
    # Remove thinking tags if present
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    text = re.sub(r"<thought>.*?</thought>", "", text, flags=re.DOTALL).strip()
    
    # 1. Quick check: if already valid JSON
    try:
        json.loads(text)
        return text
    except Exception:
        pass

    # 2. Extract content inside markdown ```json ... ``` or ``` ... ```
    matches = list(re.finditer(r"```(?:json)?\s*([\s\S]*?)(?:```|$)", text))
    for m in reversed(matches):
        candidate = m.group(1).strip()
        if candidate:
            try:
                json.loads(candidate)
                return candidate
            except Exception:
                start = candidate.find("{")
                end = candidate.rfind("}")
                if start != -1 and end > start:
                    sub = candidate[start:end+1]
                    try:
                        json.loads(sub)
                        return sub
                    except Exception:
                        pass
        
    # 3. Look for balanced JSON object by scanning brace pairs
    brace_indices = [i for i, c in enumerate(text) if c == '{']
    for start in reversed(brace_indices):
        end = text.rfind("}")
        while end > start:
            sub = text[start:end+1]
            try:
                json.loads(sub)
                return sub
            except Exception:
                end = text.rfind("}", start, end)

    # 4. Fallback to outer braces slice
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return text[start:end+1]
        
    return text


class GemmaProvider:
    @staticmethod
    async def probe_ollama() -> Tuple[bool, list[str]]:
        """Checks if local Ollama daemon is running and lists installed models."""
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(f"{settings.ollama_base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    models = [m.get("name", "") for m in data.get("models", [])]
                    return True, models
        except Exception:
            pass
        return False, []

    @staticmethod
    async def get_provider_status() -> Dict[str, Any]:
        """Returns the current Gemma inference configuration and connectivity."""
        ollama_available, ollama_models = await GemmaProvider.probe_ollama()
        
        has_gemini = bool(settings.gemini_api_key)
        has_groq = bool(settings.groq_api_key)
        has_openrouter = bool(settings.openrouter_api_key)
        has_hf = bool(settings.huggingface_api_key)
        has_custom = bool(settings.gemma_base_url)

        # Determine active backend
        backend_choice = settings.gemma_backend.lower()
        if backend_choice == "auto":
            if ollama_available and any("gemma" in m.lower() for m in ollama_models):
                active_mode = "ollama_local"
                active_model = next((m for m in ollama_models if "gemma" in m.lower()), "gemma2:9b")
            elif ollama_available:
                active_mode = "ollama_local"
                active_model = settings.gemma_model
            elif has_gemini:
                active_mode = "gemini_api"
                active_model = f"{settings.gemini_model} (Google AI Studio)"
            elif has_groq:
                active_mode = "groq_api"
                active_model = "gemma2-9b-it (Groq)"
            elif has_openrouter:
                active_mode = "openrouter_api"
                active_model = "google/gemma-2-9b-it"
            elif has_hf:
                active_mode = "huggingface_api"
                active_model = "google/gemma-2-9b-it"
            elif has_custom:
                active_mode = "openai_compatible"
                active_model = settings.gemma_model
            else:
                active_mode = "demo_mode"
                active_model = "gemma-2-9b-it (sample demo fixture)"
        elif backend_choice in ("gemini", "gemini_api", "google", "google_ai_studio"):
            active_mode = "gemini_api"
            active_model = f"{settings.gemini_model} (Google AI Studio)"
        else:
            active_mode = backend_choice
            active_model = settings.gemma_model

        return {
            "active_mode": active_mode,
            "active_model": active_model,
            "is_local_inference": active_mode == "ollama_local",
            "ollama_running": ollama_available,
            "ollama_models": ollama_models,
            "remote_providers_configured": {
                "google_ai_studio": has_gemini,
                "groq": has_groq,
                "openrouter": has_openrouter,
                "huggingface": has_hf,
                "custom_endpoint": has_custom
            },
            "open_weight_model": "Google Gemma 2",
            "model_license": "Gemma Terms of Use / Open Weights",
            "privacy_guarantee": (
                "When using Ollama local inference, no garden data leaves your machine. "
                "When using cloud Gemma endpoints, only garden parameters are sent for planning."
            )
        }

    @staticmethod
    async def generate_response(prompt: str, is_health_check: bool = False, force_demo: bool = False) -> Tuple[Dict[str, Any], str, str]:
        """Calls the configured Gemma model and returns (parsed_json, model_id, inference_mode).
        Raises descriptive exceptions on network or model failures.
        """
        status = await GemmaProvider.get_provider_status()
        active_mode = status["active_mode"]
        active_model = status["active_model"]

        if force_demo or active_mode == "demo_mode":
            # Return verified demo fixture with honest labels
            if is_health_check:
                demo_json = GemmaProvider.get_demo_health_assessment()
            else:
                demo_json = GemmaProvider.get_demo_garden_plan()
            return demo_json, "gemma-2-9b-it (sample demo fixture)", "demo_mode"

        # 1. Ollama local inference
        if active_mode == "ollama_local":
            try:
                async with httpx.AsyncClient(timeout=settings.inference_timeout_seconds) as client:
                    resp = await client.post(
                        f"{settings.ollama_base_url}/api/generate",
                        json={
                            "model": active_model,
                            "prompt": prompt,
                            "stream": False,
                            "format": "json",
                            "options": {
                                "temperature": 0.2,
                                "top_p": 0.95
                            }
                        }
                    )
                    if resp.status_code != 200:
                        raise RuntimeError(f"Ollama server returned error {resp.status_code}: {resp.text}")
                    data = resp.json()
                    raw_text = data.get("response", "")
                    clean_text = clean_json_response(raw_text)
                    parsed = json.loads(clean_text)
                    return parsed, active_model, "ollama_local"
            except httpx.ConnectError:
                raise RuntimeError(
                    f"Unable to connect to local Ollama at {settings.ollama_base_url}. "
                    "Please ensure Ollama is installed and running ('ollama serve' and 'ollama run gemma2:9b')."
                )
            except httpx.TimeoutException:
                raise TimeoutError(f"Ollama inference timed out after {settings.inference_timeout_seconds}s.")
            except json.JSONDecodeError as jde:
                raise ValueError(f"Gemma model returned invalid JSON structure: {jde}")

        # 1b. Google AI Studio Gemma endpoint (Official Google API)
        if active_mode == "gemini_api":
            try:
                endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent"
                headers = {
                    "Content-Type": "application/json",
                    "x-goog-api-key": settings.gemini_api_key,
                }
                async with httpx.AsyncClient(timeout=settings.inference_timeout_seconds) as client:
                    resp = await client.post(
                        endpoint,
                        headers=headers,
                        json={
                            "contents": [
                                {
                                    "role": "user",
                                    "parts": [{"text": prompt}]
                                }
                            ],
                            "generationConfig": {
                                "temperature": 0.2,
                                "responseMimeType": "application/json"
                            }
                        }
                    )
                    if resp.status_code != 200:
                        raise RuntimeError(f"Google AI Studio Gemma error ({resp.status_code}): {resp.text}")
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if not candidates:
                        raise RuntimeError(f"Google AI Studio returned no candidate responses: {data}")
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if not parts:
                        raise RuntimeError("Google AI Studio response candidate contained no text parts.")
                    
                    # Extract the non-thought content part, or fall back to the last part
                    content = next((p.get("text", "") for p in reversed(parts) if p.get("text") and not p.get("thought")), parts[-1].get("text", ""))
                    clean_text = clean_json_response(content)
                    try:
                        parsed = json.loads(clean_text)
                    except json.JSONDecodeError as jde:
                        raise ValueError(f"Google AI Studio Gemma returned invalid JSON structure: {jde}")
                    return parsed, f"{settings.gemini_model} (Google AI Studio)", "gemini_api"
            except httpx.TimeoutException:
                raise TimeoutError("Google AI Studio Gemma inference timed out.")
            except (ValueError, TimeoutError, RuntimeError):
                raise
            except Exception as e:
                raise RuntimeError(f"Google AI Studio Gemma inference failed: {str(e)}")

        # 2. Groq cloud API (Gemma 2 9B IT)
        if active_mode == "groq_api":
            try:
                async with httpx.AsyncClient(timeout=settings.inference_timeout_seconds) as client:
                    resp = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {settings.groq_api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": "gemma2-9b-it",
                            "messages": [
                                {"role": "system", "content": "You are a professional botanical and garden planning assistant. Always output valid JSON conforming exactly to the requested schema."},
                                {"role": "user", "content": prompt}
                            ],
                            "temperature": 0.3,
                            "response_format": {"type": "json_object"}
                        }
                    )
                    if resp.status_code != 200:
                        raise RuntimeError(f"Groq Gemma API error ({resp.status_code}): {resp.text}")
                    data = resp.json()
                    content = data["choices"][0]["message"]["content"]
                    clean_text = clean_json_response(content)
                    parsed = json.loads(clean_text)
                    return parsed, "gemma2-9b-it (Groq Cloud)", "groq_api"
            except httpx.TimeoutException:
                raise TimeoutError("Groq Gemma inference timed out.")
            except Exception as e:
                raise RuntimeError(f"Groq Gemma inference failed: {str(e)}")

        # 3. OpenRouter (google/gemma-2-9b-it)
        if active_mode == "openrouter_api":
            try:
                async with httpx.AsyncClient(timeout=settings.inference_timeout_seconds) as client:
                    resp = await client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {settings.openrouter_api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": "google/gemma-2-9b-it",
                            "messages": [{"role": "user", "content": prompt}],
                            "temperature": 0.3
                        }
                    )
                    if resp.status_code != 200:
                        raise RuntimeError(f"OpenRouter Gemma error ({resp.status_code}): {resp.text}")
                    data = resp.json()
                    content = data["choices"][0]["message"]["content"]
                    clean_text = clean_json_response(content)
                    parsed = json.loads(clean_text)
                    return parsed, "google/gemma-2-9b-it (OpenRouter)", "openrouter_api"
            except Exception as e:
                raise RuntimeError(f"OpenRouter Gemma inference failed: {str(e)}")

        # 3b. Hugging Face Inference API (google/gemma-2-9b-it)
        if active_mode == "huggingface_api":
            try:
                async with httpx.AsyncClient(timeout=settings.inference_timeout_seconds) as client:
                    resp = await client.post(
                        "https://router.huggingface.co/together/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {settings.huggingface_api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": "google/gemma-2-9b-it",
                            "messages": [{"role": "user", "content": prompt}],
                            "temperature": 0.3
                        }
                    )
                    if resp.status_code != 200:
                        raise RuntimeError(f"Hugging Face Gemma API error ({resp.status_code}): {resp.text}")
                    data = resp.json()
                    content = data["choices"][0]["message"]["content"]
                    clean_text = clean_json_response(content)
                    parsed = json.loads(clean_text)
                    return parsed, "google/gemma-2-9b-it (Hugging Face)", "huggingface_api"
            except Exception as e:
                raise RuntimeError(f"Hugging Face Gemma inference failed: {str(e)}")

        # 4. Custom OpenAI-compatible Gemma endpoint
        if active_mode == "openai_compatible":
            try:
                endpoint = f"{settings.gemma_base_url.rstrip('/')}/chat/completions"
                headers = {"Content-Type": "application/json"}
                if settings.gemma_api_key:
                    headers["Authorization"] = f"Bearer {settings.gemma_api_key}"
                async with httpx.AsyncClient(timeout=settings.inference_timeout_seconds) as client:
                    resp = await client.post(
                        endpoint,
                        headers=headers,
                        json={
                            "model": active_model,
                            "messages": [{"role": "user", "content": prompt}],
                            "temperature": 0.3
                        }
                    )
                    if resp.status_code != 200:
                        raise RuntimeError(f"Custom Gemma endpoint error ({resp.status_code}): {resp.text}")
                    data = resp.json()
                    content = data["choices"][0]["message"]["content"]
                    clean_text = clean_json_response(content)
                    parsed = json.loads(clean_text)
                    return parsed, active_model, "openai_compatible"
            except Exception as e:
                raise RuntimeError(f"Custom Gemma endpoint inference failed: {str(e)}")

        # Fallback if no backend configured and not force_demo
        raise RuntimeError(
            "No active Gemma inference engine configured. Please start Ollama with 'gemma2:9b', "
            "provide a GROQ_API_KEY with Gemma 2 access, or select 'Use Sample Demo Data' mode."
        )

    @staticmethod
    def get_demo_garden_plan() -> Dict[str, Any]:
        """Returns realistic, verified reference plan for testing and demo inspection."""
        return {
            "summary": "Balanced 7-day tropical balcony garden plan focusing on culinary herbs and pest-repelling companion flowers.",
            "garden_assessment": "The 40 sq ft east-facing balcony in coastal Karnataka receives 4-5 hours of morning sunlight. High coastal humidity and warm temperatures (28-32°C) make it ideal for vigorous herbs like Tulsi and Mint, while companion Marigolds protect container tomatoes against local pests.",
            "recommended_plants": [
                {
                    "name": "Holy Basil (Tulsi)",
                    "scientific_name": "Ocimum tenuiflorum",
                    "reason": "Thrives in warm morning sun and high humidity; sacred culinary staple that repels common balcony flies.",
                    "sunlight_fit": "Morning partial sun (4+ hours) is optimal to prevent scorching while keeping leaves aromatic.",
                    "container_or_spacing": "10-inch terracotta pot with center drainage hole and 30% compost mix.",
                    "sowing_or_care_advice": "Pinch terminal flower buds twice weekly to keep plant bushy and prevent woody stems.",
                    "watering_guidance": "Water once daily in the early morning; avoid evening moisture on leaves.",
                    "days_to_harvest_estimate": "Leaves harvestable immediately; full canopy in 45 days"
                },
                {
                    "name": "Spearmint (Pudina)",
                    "scientific_name": "Mentha spicata",
                    "reason": "Very fast grower in partial shade, rewarding beginners with fragrant tea leaves.",
                    "sunlight_fit": "Prefers 3-4 hours of dappled sunlight; wilts if placed in scorching midday sun.",
                    "container_or_spacing": "Wide rectangular planter box (8 inches deep) to allow runners to spread.",
                    "sowing_or_care_advice": "Keep in an isolated container because invasive stolons will crowd out slower companions.",
                    "watering_guidance": "High moisture requirement; soil should stay consistently damp like a wrung-out sponge.",
                    "days_to_harvest_estimate": "Snip top 2 inches in 14-21 days"
                },
                {
                    "name": "French Marigold",
                    "scientific_name": "Tagetes patula",
                    "reason": "Bright cheerful blooms attract beneficial pollinating bees and deter aphids with root exudates.",
                    "sunlight_fit": "Needs the brightest balcony corner (5+ hours direct light) to set abundant flower buds.",
                    "container_or_spacing": "8-inch pot or planted alongside tomato containers as an eco-friendly guard.",
                    "sowing_or_care_advice": "Deadhead faded flower heads weekly to spur fresh floral blooms.",
                    "watering_guidance": "Moderate; allow top inch of soil to dry before soaking.",
                    "days_to_harvest_estimate": "First blooms in 30-40 days"
                },
                {
                    "name": "Cherry Tomato",
                    "scientific_name": "Solanum lycopersicum",
                    "reason": "High yield in small containers; produces sweet bite-sized fruits in sunny balcony spots.",
                    "sunlight_fit": "Position in the prime sunny spot with 5-6 hours of light.",
                    "container_or_spacing": "12-14 inch pot with a sturdy bamboo staking cage.",
                    "sowing_or_care_advice": "Remove suckers between stem and branch for stronger central fruit truss development.",
                    "watering_guidance": "Consistent watering to prevent blossom end rot; mulch soil surface.",
                    "days_to_harvest_estimate": "65-75 days to first red clusters"
                }
            ],
            "weekly_tasks": [
                {
                    "id": "task-day1",
                    "day_number": 1,
                    "day_label": "Day 1 (Monday)",
                    "title": "Soil Moisture Audit & Sunlight Mapping",
                    "description": "Walk out to the balcony at 9:00 AM and 2:00 PM. Note which corners receive direct sun and insert index finger 2 inches into container soil to check moisture depth.",
                    "estimated_minutes": 15,
                    "materials": ["Gardening notepad or chalk marker", "Wooden pencil or moisture probe"],
                    "outdoor_mission": "Breathe the morning air, leave your phone indoors, and feel the soil texture between your fingers."
                },
                {
                    "id": "task-day2",
                    "day_number": 2,
                    "day_label": "Day 2 (Tuesday)",
                    "title": "Tulsi Apex Pinching & Mint Trimming",
                    "description": "Gently pinch off any purple flowering tops from the Tulsi plant to channel nutrients into lush new side foliage. Snip long leggy mint runners.",
                    "estimated_minutes": 15,
                    "materials": ["Clean garden scissors or clean fingernails", "Small tea cup for harvested leaves"],
                    "outdoor_mission": "Crush a freshly picked mint leaf between your palms and inhale the natural cooling menthol aroma."
                },
                {
                    "id": "task-day3",
                    "day_number": 3,
                    "day_label": "Day 3 (Wednesday)",
                    "title": "Organic Drainage Inspection & Mulch Top-Up",
                    "description": "Inspect underneath all planter saucers. Clear blocked holes to prevent stagnant water where mosquito larvae breed. Spread dry leaf mulch around tomato bases.",
                    "estimated_minutes": 20,
                    "materials": ["Small hand trowel", "Dry leaf litter or coco-peat mulch"],
                    "outdoor_mission": "Listen for urban bird songs and watch for pollinators visiting your balcony flowers."
                },
                {
                    "id": "task-day4",
                    "day_number": 4,
                    "day_label": "Day 4 (Thursday)",
                    "title": "Gentle Underside Foliage Pest Check",
                    "description": "Turn over 10 leaves on the tomato and chilli plants. Check for whitefly specks or curling leaf margins. Wipe dusty leaves gently with a damp cotton cloth.",
                    "estimated_minutes": 15,
                    "materials": ["Damp soft cotton cloth", "Magnifying glass (optional)"],
                    "outdoor_mission": "Spend 5 minutes quietly observing ant or ladybug activity along the stems."
                },
                {
                    "id": "task-day5",
                    "day_number": 5,
                    "day_label": "Day 5 (Friday)",
                    "title": "Nourishing Compost Tea Feeding",
                    "description": "Dilute 2 tablespoons of vermicompost in a jug of water. Stir well and pour directly into the root zones of the heavy-feeding cherry tomato and marigold.",
                    "estimated_minutes": 20,
                    "materials": ["Vermicompost", "Watering can", "Wooden stirrer"],
                    "outdoor_mission": "Feel the restorative connection of feeding living soil organisms that nourish your food."
                },
                {
                    "id": "task-day6",
                    "day_number": 6,
                    "day_label": "Day 6 (Saturday)",
                    "title": "Balcony Trellis & Stake Adjustment",
                    "description": "Gently tie emerging cherry tomato vines to bamboo supports using soft twine. Remove lower yellowing leaves touching the soil.",
                    "estimated_minutes": 25,
                    "materials": ["Soft jute twine", "Bamboo stakes", "Pruning shears"],
                    "outdoor_mission": "Take off your footwear on the balcony floor and stretch in the warm weekend sunlight."
                },
                {
                    "id": "task-day7",
                    "day_number": 7,
                    "day_label": "Day 7 (Sunday)",
                    "title": "Fresh Herb Harvest & Weekly Reflection",
                    "description": "Harvest a generous fistful of mint and Tulsi leaves for Sunday afternoon herbal tea. Note any new sprouts or growth milestones in your journal.",
                    "estimated_minutes": 20,
                    "materials": ["Clean harvest basket", "Whetstone or cloth to clean shears"],
                    "outdoor_mission": "Sip fresh garden-grown tea outdoors on your balcony while appreciating a week of active plant care."
                }
            ],
            "soil_and_compost_guidance": "In warm humid coastal environments, container potting soil compacts quickly. Mix equal parts coco-peat (for moisture retention), red soil or loam, and well-rotted vermicompost. Add a handful of neem cake powder per pot to deter soil nematodes.",
            "pest_prevention_tips": [
                "Position companion marigolds adjacent to solanaceous plants (tomatoes, chillies).",
                "Spray diluted neem oil (5ml per liter of water with 2 drops mild soap) once every 14 days during early morning.",
                "Avoid spraying foliage at sunset to eliminate stagnant moisture that fosters powdery mildew."
            ],
            "materials_needed": [
                "10-inch terracotta pots & saucers",
                "Organic vermicompost",
                "Jute garden twine & bamboo stakes",
                "Neem cake powder & neem oil spray",
                "Clean hand pruning snips"
            ],
            "assumptions": [
                "Assumes pots have unobstructed bottom drainage holes.",
                "Assumes tap water does not have high saline or chloramine levels; allow municipal water to stand 12 hours before watering.",
                "Assumes average balcony temperatures range between 26°C and 34°C."
            ],
            "safety_notes": [
                "Always wash hands with soap after handling tomato foliage (leaves contain mild solanine alkaloids).",
                "Avoid applying raw uncomposted kitchen scraps directly into pots to prevent rodent attraction.",
                "Stay hydrated and avoid heavy gardening tasks during midday coastal heat."
            ],
            "sources": [
                "Indian Council of Agricultural Research (ICAR) Balcony Gardening Handbook",
                "Royal Horticultural Society (RHS) Companion Planting Guide",
                "University of Agricultural Sciences, Bangalore Extension Services"
            ]
        }

    @staticmethod
    def get_demo_health_assessment() -> Dict[str, Any]:
        """Returns realistic, verified plant diagnostic fixture for offline demo."""
        return {
            "plant_name": "Holy Basil (Tulsi)",
            "symptoms_evaluated": ["Yellowing lower leaves", "Brown leaf margins", "Slight drooping"],
            "possible_causes": [
                {
                    "cause_name": "Overwatering with Poor Drainage (Root Suffocation)",
                    "rank": 1,
                    "likelihood": "High",
                    "reasoning": "Frequent watering combined with humid coastal air prevents potting soil from drying out, depriving roots of oxygen and causing lower leaves to turn chlorotic (yellow) first."
                },
                {
                    "cause_name": "Nitrogen Depletion in Leached Potting Mix",
                    "rank": 2,
                    "likelihood": "Moderate",
                    "reasoning": "Frequent daily irrigation flushes mobile nitrogen from small containers, forcing the plant to mobilize nitrogen from older lower leaves to newer shoots."
                },
                {
                    "cause_name": "Fungal Root Stress (Early Pythium)",
                    "rank": 3,
                    "likelihood": "Low",
                    "reasoning": "Prolonged waterlogging in poorly aerated pots can trigger root fungus, manifesting as dark brown tips alongside drooping."
                }
            ],
            "distinguishing_questions": [
                "Does the potting soil remain wet and soggy when you insert your finger 2 inches down, or does it feel bone dry?",
                "Are there stagnant puddles in the pot saucer underneath?",
                "Are the new top leaves emerging green and healthy, or are they also yellow and stunted?"
            ],
            "low_risk_checks": [
                "Perform the 2-inch Finger Test: Touch soil 2 inches below surface. If damp and cool, do not water today.",
                "Check Drainage Hole: Lift the pot and verify roots or soil sludge are not obstructing water exit.",
                "Inspect Leaf Undersides: Use natural light to check for tiny web-spinning mites or pale aphid clusters."
            ],
            "action_steps": [
                "Withhold watering for 48 to 72 hours until the top 1.5 inches of soil feels crumbly and dry to touch.",
                "Empty standing water from the saucer beneath the container immediately.",
                "Prune dead or severely yellowed lower leaves with clean scissors to redirect plant energy to healthy stems.",
                "Top-dress the pot with 2 handfuls of well-aged organic vermicompost to replenish leached nitrogen once the soil dries."
            ],
            "when_to_seek_expert": (
                "If stems turn black or mushy at the soil line, or if wilting persists despite completely dry soil, "
                "consult a local agricultural extension office or horticulture center with a fresh stem sample."
            ),
            "safety_notes": [
                "Do NOT apply synthetic chemical fungicides or harsh chemical pesticides to edible culinary herbs like Tulsi.",
                "Keep scissors sterilized with rubbing alcohol to prevent transferring plant pathogens between pots."
            ]
        }
