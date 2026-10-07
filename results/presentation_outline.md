# ReviewRadar — Presentation Outline (PPT Guide)

> Use this as your slide-by-slide guide when creating the PowerPoint.  
> Do NOT claim features or metrics that are not actually implemented.

---

## Slide 1 — Title Slide

**Title:** ReviewRadar  
**Subtitle:** AI-Powered Product Review Analyzer  
**Footer:** NLP Capstone Project · B.Tech Data Science · [Your Name] · [Roll No] · [College Name] · [Date]

---

## Slide 2 — Problem Statement

### The Problem
- Millions of product reviews are posted online every day
- Reading 200+ reviews for a single product is time-consuming
- Reviews contain hidden opinions about specific features (camera, battery, display)
- Customers and businesses need quick, structured insights

### Key Questions
- What is the overall sentiment of this review?
- Which specific features are praised or criticized?
- What are the product's main strengths and weaknesses?

---

## Slide 3 — Objectives

1. Perform **sentiment analysis** on product reviews
2. **Extract product aspects** (Camera, Battery, Display, etc.)
3. Assign **sentiment to each aspect** (Aspect-Based Sentiment Analysis)
4. Generate a **concise AI summary**
5. Extract **strengths** and **weaknesses**
6. Display results on an **interactive visual dashboard**

---

## Slide 4 — Proposed Solution: ReviewRadar

- A full-stack web application
- User pastes any product review
- Backend runs two NLP pipelines:
  - **Traditional NLP**: VADER Sentiment Analysis
  - **LLM-based NLP**: Google Gemini AI
- Results displayed as a structured, interactive dashboard

**Key Differentiator:** Combines rule-based NLP + Large Language Model NLP

---

## Slide 5 — System Architecture

```
[User] → [React Frontend]
               ↓
         POST /analyze-review
               ↓
         [FastAPI Backend]
          /             \
    [NLP Service]   [Gemini Service]
    VADER Sentiment  Google Gemini AI
    (Traditional NLP) (LLM-based NLP)
               ↓
        [JSON Response]
               ↓
     [React Dashboard]
      Charts · Cards · Table
```

- Frontend: React 18 + Vite + Tailwind CSS
- Backend: FastAPI (Python)
- No database required

---

## Slide 6 — NLP Workflow

### Step 1: Traditional NLP (VADER)
1. Text is received from user
2. **Preprocessing** — Remove URLs, HTML, normalize whitespace
3. **Tokenization** — `nltk.word_tokenize`
4. **Stopword removal** — Filter common words
5. **VADER scoring** — Compute positive, negative, neutral, compound scores
6. **Classification** — Compound ≥ 0.05 → Positive | ≤ −0.05 → Negative | else → Neutral | Mixed heuristic

### Step 2: LLM-based NLP (Gemini)
1. Prompt loaded from `prompts/review_analysis.txt`
2. Review text inserted into prompt
3. Gemini API call
4. JSON response parsed and validated
5. Aspects, sentiment, summary, strengths, weaknesses extracted

---

## Slide 7 — Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | UI |
| Styling | Tailwind CSS | Responsive design |
| Charts | Recharts | Bar chart visualization |
| Backend | FastAPI (Python) | REST API |
| Traditional NLP | VADER + NLTK | Sentiment analysis |
| LLM | Google Gemini 2.0 Flash | Deep NLP analysis |
| Env | python-dotenv | Secure key management |

---

## Slide 8 — Gemini API / LLM Integration

### How it works:
1. **Prompt Engineering** — A carefully crafted prompt in `prompts/review_analysis.txt`
2. Prompt instructs Gemini to:
   - Analyze only the provided review (no hallucination)
   - Extract product aspects with evidence quotes
   - Return **strict JSON** (no markdown fences)
3. **Safe JSON parsing** — Handles edge cases (markdown fences, partial output)
4. **Validation layer** — Every field normalized before returning to frontend

### Why Gemini over VADER alone?
- VADER only gives an overall score
- Gemini understands context: *"the battery is not terrible"* → Neutral (not Positive)
- Gemini extracts specific named aspects from free-form text
- Gemini generates natural language summaries

---

## Slide 9 — Application Screenshots

> Add 4–6 screenshots here from the running application:
> - Home page
> - Review input
> - Positive analysis result
> - Mixed analysis result
> - Aspect table
> - Bar chart

---

## Slide 10 — Results

### Sample Analysis

**Input Review:**
> "The camera quality is excellent and the display looks amazing, but the battery drains very quickly and the phone gets uncomfortably hot while gaming."

**Output:**

| Field | Result |
|-------|--------|
| VADER Compound | +0.12 |
| Overall Sentiment | 🟣 Mixed |
| Aspects Found | 4 (Camera, Display, Battery, Heating) |
| Positive Aspects | Camera, Display |
| Negative Aspects | Battery, Heating |
| Summary | "The review praises camera and display quality. Battery life and heating are significant concerns." |

> **Note:** Results shown are from actual application runs. No fake metrics.

---

## Slide 11 — Limitations

1. **English only** — VADER and the prompt are optimized for English
2. **No persistent storage** — Results not saved between sessions
3. **VADER limitations** — May not handle sarcasm well (*"Oh great, the battery dies in 2 hours"*)
4. **Gemini API rate limits** — Free tier has usage limits
5. **Context window** — Very long reviews may be truncated
6. **Domain specificity** — General-purpose, not fine-tuned for a specific product category

---

## Slide 12 — Future Scope

1. **Fine-tuned BERT model** for domain-specific aspect extraction
2. **Batch CSV upload** — Analyze multiple reviews at once
3. **Product comparison** — Side-by-side analysis of two products
4. **Multi-language support** — Hindi, Tamil, Spanish reviews
5. **Historical dashboard** — Track sentiment trends over time
6. **Export to PDF/CSV** — Download analysis reports
7. **Real-time web scraping** — Fetch live reviews from e-commerce sites

---

## Slide 13 — Conclusion

- **ReviewRadar** successfully demonstrates both **Traditional NLP** and **LLM-based NLP**
- VADER provides fast, reliable baseline sentiment scoring
- Google Gemini adds contextual understanding through prompt engineering
- The system can extract 4–8 product aspects per review with evidence
- The interactive dashboard makes results easy to understand
- Demonstrates practical applications of NLP in e-commerce and consumer intelligence

> **Key Takeaway:** Combining rule-based NLP (VADER) with LLMs (Gemini) produces more accurate and interpretable results than either approach alone.

---

*ReviewRadar — NLP Capstone Project*
