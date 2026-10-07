# ReviewRadar — AI Product Review Analyzer

> **Name:** Archit Gupta  
> **Reg. No.:** 23FE10CDS00265  
> **Branch:** CSE (Data Science)  
> **Section:** D  
> **NLP Section:** B  

---

> **NLP Capstone Project** — B.Tech Data Science  
> Demonstrating Traditional NLP (VADER) + LLM-based NLP (Google Gemini AI)

---

## 📖 Project Overview

**ReviewRadar** is an NLP-based product review analysis system that helps users understand product reviews at a deeper level. A user pastes any product review, and the system performs:

- **Sentiment Analysis** (VADER — traditional NLP)
- **Aspect Extraction** (Gemini AI — LLM-based NLP)
- **Aspect-level Sentiment** (per feature: Camera, Battery, Display, etc.)
- **AI-generated Summary** (Gemini)
- **Strengths & Weaknesses** extraction (Gemini)
- **Visual Dashboard** (Recharts bar chart)

---

## 🔍 Problem Statement

Online product reviews contain valuable opinions, but reading hundreds of reviews is time-consuming. Customers and businesses need tools that can:

1. Instantly determine the overall sentiment of a review
2. Identify which specific product features are praised or criticized
3. Summarize the review in 2–3 sentences
4. Present results in a clear, visual format

---

## 🎯 Objectives

1. Demonstrate traditional NLP using **VADER** sentiment analysis
2. Demonstrate LLM-based NLP using the **Google Gemini API**
3. Extract product aspects and their individual sentiments
4. Generate a concise AI summary
5. Display results on an interactive dashboard
6. Build a working full-stack web application (React + FastAPI)

---

## ✨ Features

| Feature | Technology |
|---------|-----------|
| Overall sentiment analysis | VADER (traditional NLP) |
| Aspect extraction | Gemini AI (LLM) |
| Aspect-level sentiment | Gemini AI (LLM) |
| AI summary generation | Gemini AI (LLM) |
| Strengths extraction | Gemini AI (LLM) |
| Weaknesses extraction | Gemini AI (LLM) |
| Sentiment bar chart | Recharts |
| Responsive dashboard | React + Tailwind CSS |

---

## 🧠 NLP Techniques Used

### Traditional NLP (VADER)
- **Text Preprocessing** — URL removal, HTML stripping, whitespace normalisation
- **Tokenization** — `nltk.word_tokenize`
- **Stopword Removal** — `nltk.corpus.stopwords`
- **Sentiment Scoring** — VADER compound score, positive/negative/neutral proportions
- **Classification** — Rule-based thresholds (compound ≥ 0.05 → Positive, ≤ −0.05 → Negative, mixed heuristic)

### LLM-based NLP (Gemini AI)
- **Prompt Engineering** — Structured prompt in `prompts/review_analysis.txt`
- **Aspect-Based Sentiment Analysis (ABSA)** — Extracting product features and their sentiments
- **Text Summarization** — Concise 2–3 sentence summaries
- **Information Extraction** — Strengths and weaknesses from unstructured text
- **Structured Output** — Gemini instructed to return strict JSON

---

## 🛠️ Technology Stack

### Frontend
- **React 18** — UI library
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Utility-first styling
- **Recharts** — Data visualisation
- **Lucide React** — Icons

### Backend
- **Python 3.10+**
- **FastAPI** — REST API framework
- **VADER Sentiment** — Traditional NLP sentiment analysis
- **NLTK** — Natural Language Toolkit (tokenization, stopwords)
- **Google Gemini AI** (`google-genai`) — LLM-based analysis
- **python-dotenv** — Environment variable management

---

## 🏗️ System Architecture

```
[User Browser]
      |
      | HTTP POST /analyze-review
      ↓
[React Frontend — Vite + Tailwind]
      |
      | Proxy /api → localhost:8000
      ↓
[FastAPI Backend — Python]
      |
      |── [NLP Service]
      |       └── VADER Sentiment Analysis
      |           (text preprocessing → VADER scores → label)
      |
      |── [Gemini Service]
      |       └── Google Gemini AI
      |           (prompt engineering → JSON response → validation)
      |
      ↓
[Structured JSON Response]
      |
      ↓
[React Dashboard]
      ├── Sentiment Card (VADER scores)
      ├── Summary Card (Gemini)
      ├── Aspect Analysis Table (Gemini)
      ├── Strengths & Weaknesses (Gemini)
      └── Bar Chart (Recharts)
```

---

## 📁 Folder Structure

```
ReviewRadar/
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ReviewInput.jsx
│   │   │   ├── SentimentCard.jsx
│   │   │   ├── SummaryCard.jsx
│   │   │   ├── AspectAnalysis.jsx
│   │   │   ├── AspectChart.jsx
│   │   │   ├── StrengthsWeaknesses.jsx
│   │   │   ├── ErrorBanner.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   └── sentimentUtils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                     # FastAPI application
│   ├── main.py                  # App entry point + endpoints
│   ├── requirements.txt
│   ├── services/
│   │   ├── nlp_service.py       # VADER + NLTK
│   │   └── gemini_service.py    # Google Gemini AI
│   └── utils/
│
├── prompts/
│   └── review_analysis.txt      # Gemini prompt template
│
├── data/
│   └── sample_reviews.csv       # 18 sample reviews for testing
│
├── results/
│   └── test_results.md          # Test case documentation
│
├── screenshots/                 # App screenshots (add after running)
│
├── .env.example                 # Environment variable template
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- **Node.js** 18+ and **npm**
- **Python** 3.10+
- A **Google Gemini API key** — [Get one here](https://aistudio.google.com/app/apikey)

### 1. Clone / Download the project

```bash
cd "Review Radar"
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your real key:

```env
GEMINI_API_KEY=your_actual_key_here
```

> ⚠️ **Never commit `.env` to git.** It is already in `.gitignore`.

---

## 🚀 How to Run

### Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend will be available at: **http://localhost:8000**  
API docs: **http://localhost:8000/docs**

### Frontend (React + Vite)

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## 🌐 API Endpoints

### `GET /health`

Health check.

**Response:**
```json
{
  "status": "ok",
  "service": "ReviewRadar API"
}
```

---

### `POST /analyze-review`

Analyze a product review.

**Request body:**
```json
{
  "review": "The camera quality is excellent but the battery drains quickly."
}
```

**Response:**
```json
{
  "success": true,
  "review": "...",
  "sentiment": {
    "label": "mixed",
    "positive": 0.45,
    "negative": 0.40,
    "neutral": 0.15,
    "compound": 0.10
  },
  "aspects": [
    {
      "aspect": "Camera",
      "sentiment": "positive",
      "evidence": "camera quality is excellent"
    },
    {
      "aspect": "Battery",
      "sentiment": "negative",
      "evidence": "battery drains quickly"
    }
  ],
  "summary": "The reviewer praises the camera quality but finds the battery life disappointing.",
  "strengths": ["Excellent camera quality"],
  "weaknesses": ["Battery drains quickly"]
}
```

---

## 📝 Example Input

```
The camera quality is excellent and the display looks amazing, but the battery drains 
very quickly and the phone gets uncomfortably hot while gaming.
```

## 📊 Example Output

| Field | Value |
|-------|-------|
| Overall Sentiment | 🟣 Mixed |
| VADER Compound | +0.12 |
| Aspects Found | Camera (Positive), Display (Positive), Battery (Negative), Heating (Negative) |
| Summary | "The review praises the phone's camera and display quality. However, battery life and heating during gaming are significant concerns." |
| Strengths | Excellent camera, Beautiful display |
| Weaknesses | Poor battery life, Heating during gaming |

---

## 📸 Screenshots

> Add screenshots to the `screenshots/` folder after running the application.

| Screenshot | Description |
|-----------|-------------|
| `01_home.png` | Home page with review input |
| `02_analyzing.png` | Loading state during analysis |
| `03_mixed_result.png` | Mixed sentiment result |
| `04_aspect_table.png` | Aspect analysis table |
| `05_chart.png` | Aspect sentiment bar chart |
| `06_error.png` | Error handling display |

---

## ⚠️ Limitations

1. **No persistent storage** — Results are held in frontend state only
2. **Single review at a time** — Batch analysis not implemented
3. **Gemini rate limits** — Free tier has API usage limits
4. **Language** — Optimised for English reviews only
5. **VADER accuracy** — VADER may misinterpret sarcasm or domain-specific language
6. **Gemini hallucination** — LLMs can occasionally invent aspects not present in the text (prompt mitigates this)

---

## 🔭 Future Improvements

1. **Batch Analysis** — Upload a CSV of reviews and analyze all at once
2. **History Storage** — Save past analyses in local storage or a database
3. **Comparison Mode** — Compare two products side by side
4. **Multi-language Support** — Non-English review analysis
5. **Export** — Download analysis results as PDF or CSV
6. **Fine-tuned Model** — Replace Gemini with a fine-tuned BERT model for aspect extraction
7. **Real-time Scraping** — Fetch reviews directly from Amazon or Flipkart

---

## 📚 Academic References

- Hutto, C.J. & Gilbert, E.E. (2014). VADER: A Parsimonious Rule-based Model for Sentiment Analysis of Social Media Text. *ICWSM*.
- Google Gemini API documentation: https://ai.google.dev/
- Bird, S., Klein, E., & Loper, E. (2009). Natural Language Processing with Python. O'Reilly Media.

---

*ReviewRadar — NLP Capstone Project · B.Tech Data Science*
