# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

The AI Garden Buddy team is committed to ensuring the security and privacy of users. We take privacy-conscious computing seriously.

If you discover a security vulnerability or sensitive data leakage flaw:
1. **Do not** file a public issue on GitHub.
2. Email the maintainers directly or use GitHub's private vulnerability reporting feature under the Security tab.
3. Include details of the vulnerability, reproduction steps, and impact assessment.
4. We will acknowledge receipt within 48 hours and work on a remediation patch promptly.

### Open-Weight AI & Privacy Assurances
- AI Garden Buddy does not transmit telemetry or user garden designs to third-party ad networks.
- When configured with local Ollama (`GEMMA_BACKEND=ollama`), all generative model inference executes exclusively on the user's host machine.
- API keys provided via environment variables (`GROQ_API_KEY`, `OPENROUTER_API_KEY`) are kept on the server side and never exposed to the client browser.
