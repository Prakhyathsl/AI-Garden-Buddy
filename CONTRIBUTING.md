# Contributing to AI Garden Buddy

Thank you for your interest in contributing to **AI Garden Buddy**! We are participating in **Hacktoberfest 2026** and welcome issues, bug reports, feature suggestions, botanical database enhancements, and pull requests.

## Hackathon Focus
This project is built for the **Hacktoberfest 2026 Week 1 Open-Source AI Challenge**, specifically targeting the **Best Use of Gemma** partner category. All AI contributions must center on Google's open-weight Gemma family (`gemma2:2b`, `gemma2:9b`, `gemma2:27b`).

## How to Contribute

### 1. Code of Conduct
Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

### 2. Local Setup
1. Clone this repository:
   ```bash
   git clone https://github.com/Prakhyathsl/Plantcare-ai.git
   cd Plantcare-ai
   ```

2. Set up the Python FastAPI backend:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate   # Or source .venv/bin/activate on Linux/macOS
   pip install -r backend/requirements.txt
   ```

3. Set up the Next.js frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Run local Gemma inference:
   Install [Ollama](https://ollama.com/) and download Gemma 2:
   ```bash
   ollama pull gemma2:9b
   ollama serve
   ```

5. Run test suite:
   ```bash
   pytest backend/tests -v
   cd frontend && npm run build
   ```

### 3. Submission Guidelines
- Maintain strict Pydantic schemas for any AI output.
- Never fake AI inference results; always accurately report `model_id` and `inference_mode`.
- Ensure all botanical and toxicity advice is verified against reputable agricultural extensions (ICAR, RHS, FAO).
- Open a Pull Request with a clear description and testing evidence.
