import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env if present
load_dotenv()


class Settings(BaseModel):
    app_name: str = "AI Garden Buddy API"
    app_version: str = "1.0.0"
    
    # Gemma Inference Configuration
    # Supported providers: "ollama", "groq", "huggingface", "openrouter", "openai_compatible", "demo"
    gemma_backend: str = os.getenv("GEMMA_BACKEND", "auto")
    gemma_model: str = os.getenv("GEMMA_MODEL", "gemma2:9b")
    
    # Ollama settings (preferred local backend)
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    
    # Cloud Gemma API options (for environments without local GPU/Ollama)
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemma-4-26b-a4b-it")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    huggingface_api_key: str = os.getenv("HUGGINGFACE_API_KEY", "")
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "")
    
    # Generic OpenAI-compatible Gemma endpoint (e.g., vLLM, llama.cpp server, LocalAI)
    gemma_base_url: str = os.getenv("GEMMA_BASE_URL", "")
    gemma_api_key: str = os.getenv("GEMMA_API_KEY", "")
    
    # Timeout & security
    inference_timeout_seconds: float = float(os.getenv("INFERENCE_TIMEOUT_SECONDS", "90.0"))
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ]


settings = Settings()
