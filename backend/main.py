"""
ReviewRadar — FastAPI Backend
==============================
Main application entry point.

Endpoints:
  GET  /health          — Health check
  POST /analyze-review  — Full NLP + Gemini analysis

Run with:
  uvicorn main:app --reload --port 8000
"""

import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

from services.nlp_service    import analyse_sentiment
from services.gemini_service import analyse_with_gemini

# ─── Environment ─────────────────────────────────────────────────────────────

load_dotenv()

# ─── Logging ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s  %(levelname)-8s  %(name)s  %(message)s',
)
logger = logging.getLogger(__name__)


# ─── Lifespan ────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("ReviewRadar backend starting…")
    yield
    logger.info("ReviewRadar backend shutting down.")


# ─── App ─────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="ReviewRadar API",
    description="NLP-powered product review analysis using VADER and Google Gemini AI.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow the React dev server (and same-origin production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:4173",   # Vite preview
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request / Response models ────────────────────────────────────────────────

class ReviewRequest(BaseModel):
    review: str

    @field_validator('review')
    @classmethod
    def validate_review(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Review text cannot be empty.")
        if len(v.split()) < 5:
            raise ValueError("Review is too short. Please provide a more detailed review.")
        if len(v) > 5000:
            raise ValueError("Review is too long. Please keep it under 5000 characters.")
        return v


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "service": "ReviewRadar API"}


@app.post("/analyze-review", tags=["Analysis"])
async def analyze_review(request: ReviewRequest):
    """
    Analyze a product review using VADER NLP and Google Gemini AI.

    Steps:
      1. VADER sentiment analysis (traditional NLP)
      2. Gemini AI analysis — aspects, summary, strengths, weaknesses

    Returns structured JSON suitable for the ReviewRadar dashboard.
    """
    review = request.review
    logger.info("Analyzing review (%d chars)…", len(review))

    # ── Step 1: VADER sentiment ───────────────────────────────────────────────
    try:
        sentiment = analyse_sentiment(review)
        logger.info("VADER sentiment: %s (compound=%.3f)", sentiment['label'], sentiment['compound'])
    except Exception as exc:
        logger.error("VADER analysis failed: %s", exc)
        raise HTTPException(status_code=500, detail="Sentiment analysis failed. Please try again.")

    # ── Step 2: Gemini AI analysis ────────────────────────────────────────────
    try:
        gemini_result = analyse_with_gemini(review)
        logger.info(
            "Gemini analysis complete. Aspects: %d, Sentiment: %s",
            len(gemini_result.get('aspects', [])),
            gemini_result.get('overall_sentiment'),
        )
    except EnvironmentError as exc:
        logger.error("Gemini config error: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="AI analysis is unavailable: GEMINI_API_KEY is not configured.",
        )
    except RuntimeError as exc:
        logger.error("Gemini analysis error: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        logger.error("Unexpected Gemini error: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="AI analysis is temporarily unavailable. Please try again.",
        )

    # ── Merge Sentiment ───────────────────────────────────────────────────────
    # We use Gemini's contextual sentiment as the primary label because it understands
    # sarcasm, nuance, and multiple languages (like Hindi) much better than VADER.
    # We still keep VADER's numerical scores for the lexicon baseline comparison.
    final_sentiment_label = gemini_result.get('overall_sentiment', sentiment['label']).lower()
    if final_sentiment_label not in ['positive', 'negative', 'neutral', 'mixed']:
        final_sentiment_label = sentiment['label']

    # Use AI confidence scores if available, otherwise fallback to VADER
    ai_scores = gemini_result.get('sentiment_scores', {})
    
    # Build response
    return {
        "success":   True,
        "review":    review,
        "sentiment": {
            "label":    final_sentiment_label,
            "positive": ai_scores.get('positive', sentiment['positive']),
            "negative": ai_scores.get('negative', sentiment['negative']),
            "neutral":  ai_scores.get('neutral',  sentiment['neutral']),
            "compound": sentiment['compound'],
        },
        "aspects":   gemini_result['aspects'],
        "summary":   gemini_result['summary'],
        "strengths": gemini_result['strengths'],
        "weaknesses": gemini_result['weaknesses'],
    }


# ─── Validation error handler ─────────────────────────────────────────────────

from fastapi.exception_handlers import request_validation_exception_handler
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_error_handler(request, exc):
    from fastapi.responses import JSONResponse
    errors = exc.errors()
    # Extract the first meaningful message
    msg = errors[0]['msg'].replace('Value error, ', '') if errors else "Invalid request."
    return JSONResponse(
        status_code=422,
        content={"success": False, "error": msg},
    )
