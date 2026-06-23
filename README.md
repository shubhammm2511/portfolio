# 🔍 Fact-Check Agent

An AI-powered Fact-Checking Web App that automates claim verification from PDF documents.

## Features

- **PDF Upload** — Upload any PDF document for automated fact-checking
- **Claim Extraction** — AI identifies specific factual claims (stats, dates, figures)
- **Live Web Verification** — Cross-references claims against current web data
- **Detailed Reports** — Each claim flagged as Verified ✅, Inaccurate ⚠️, or False ❌

## How It Works

1. Upload a PDF document
2. The AI extracts all verifiable factual claims
3. Each claim is searched against live web data
4. An AI verdict engine compares the claim against evidence
5. Results are displayed with explanations and correct information

## Tech Stack

- **Frontend**: Streamlit
- **PDF Parsing**: PyMuPDF
- **AI Engine**: Google Gemini 2.0 Flash
- **Web Search**: Serper API
- **Deployment**: Streamlit Cloud

## Setup

### API Keys Required

1. **Google Gemini API Key** — Get one free at [Google AI Studio](https://aistudio.google.com)
2. **Serper API Key** — Get one free at [serper.dev](https://serper.dev) (2,500 free queries)

### Local Development

```bash
pip install -r requirements.txt
streamlit run app.py
```

Enter your API keys in the sidebar when prompted.

### Streamlit Cloud Deployment

1. Push this repo to GitHub
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. Deploy the app pointing to `app.py`
4. Add your API keys in **Settings → Secrets**:

```toml
GEMINI_API_KEY = "your-gemini-api-key"
SERPER_API_KEY = "your-serper-api-key"
```

## License

MIT
