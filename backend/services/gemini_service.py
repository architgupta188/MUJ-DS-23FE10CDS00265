"""
Gemini Service — ReviewRadar
============================
Calls the Google Gemini API to perform:
  - Aspect extraction with per-aspect sentiment
  - Short review summary generation
  - Strengths extraction
  - Weaknesses extraction

The prompt is loaded from:  ../../prompts/review_analysis.txt

Strict JSON output is required. Safe parsing handles edge cases where
Gemini wraps the output in markdown code fences.
"""

import json
import logging
import os
import re
from pathlib import Path
from typing import Optional

from google import genai

logger = logging.getLogger(__name__)

# ─── Prompt loading ───────────────────────────────────────────────────────────

_PROMPT_PATH = Path(__file__).resolve().parents[2] / 'prompts' / 'review_analysis.txt'


def _load_prompt_template() -> str:
    """Load the prompt template from file, raising clearly if missing."""
    if not _PROMPT_PATH.exists():
        raise FileNotFoundError(
            f"Prompt file not found at: {_PROMPT_PATH}\n"
            "Make sure prompts/review_analysis.txt exists relative to the project root."
        )
    return _PROMPT_PATH.read_text(encoding='utf-8')


_PROMPT_TEMPLATE: str = _load_prompt_template()


# ─── Gemini client (lazy singleton) ──────────────────────────────────────────

_client: Optional[genai.Client] = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        api_key = os.getenv('GEMINI_API_KEY', '').strip()
        if not api_key:
            raise EnvironmentError(
                "GEMINI_API_KEY is not set. "
                "Add it to your .env file: GEMINI_API_KEY=your_key_here"
            )
        _client = genai.Client(api_key=api_key)
    return _client


# ─── JSON extraction helpers ──────────────────────────────────────────────────

def _extract_json(text: str) -> dict:
    """
    Attempt to extract a JSON object from Gemini's response.

    Handles:
      - Pure JSON responses (ideal case)
      - JSON wrapped in markdown code fences (```json ... ```)
      - Leading/trailing whitespace
    """
    text = text.strip()

    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Strip markdown fences and retry
    fence_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
    match = re.search(fence_pattern, text, re.IGNORECASE)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Last resort: find the first { ... } block
    brace_match = re.search(r'\{[\s\S]*\}', text)
    if brace_match:
        try:
            return json.loads(brace_match.group())
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not parse JSON from Gemini response:\n{text[:500]}")


def _validate_response(data: dict) -> dict:
    """
    Validate and normalise the parsed Gemini JSON.
    Fills in safe defaults for any missing fields.
    """
    valid_sentiments = {'positive', 'negative', 'neutral', 'mixed'}

    # overall_sentiment
    overall = str(data.get('overall_sentiment', 'neutral')).lower()
    if overall not in valid_sentiments:
        overall = 'neutral'
        
    scores = data.get('sentiment_scores', {})
    sentiment_scores = {
        'positive': float(scores.get('positive', 0.0)),
        'negative': float(scores.get('negative', 0.0)),
        'neutral': float(scores.get('neutral', 0.0))
    }

    # aspects
    raw_aspects = data.get('aspects', [])
    aspects = []
    if isinstance(raw_aspects, list):
        for item in raw_aspects:
            if not isinstance(item, dict):
                continue
            sentiment = str(item.get('sentiment', 'neutral')).lower()
            if sentiment not in valid_sentiments:
                sentiment = 'neutral'
            aspects.append({
                'aspect':    str(item.get('aspect', 'Unknown')).strip(),
                'sentiment': sentiment,
                'evidence':  str(item.get('evidence', '')).strip(),
            })

    # summary
    summary = str(data.get('summary', '')).strip()

    # strengths
    strengths = [str(s).strip() for s in data.get('strengths', []) if s]

    # weaknesses
    weaknesses = [str(w).strip() for w in data.get('weaknesses', []) if w]

    return {
        'overall_sentiment': overall,
        'sentiment_scores': sentiment_scores,
        'aspects':           aspects,
        'summary':           summary,
        'strengths':         strengths,
        'weaknesses':        weaknesses,
    }


# ─── Public API ──────────────────────────────────────────────────────────────

def analyse_with_gemini(review: str) -> dict:
    """
    Send the review to Gemini for deep NLP analysis.

    Returns a validated dict with:
      - overall_sentiment
      - aspects (list of {aspect, sentiment, evidence})
      - summary
      - strengths (list of str)
      - weaknesses (list of str)

    Raises:
      RuntimeError — if Gemini call fails or returns invalid JSON
    """
    prompt = _PROMPT_TEMPLATE.replace('{review}', review)

    try:
        client = _get_client()
        response = client.models.generate_content(
            model='gemini-flash-lite-latest',
            contents=prompt,
        )
        raw_text = response.text
        logger.debug("Gemini raw response:\n%s", raw_text)
    except EnvironmentError:
        raise
    except Exception as exc:
        logger.error("Gemini API call failed: %s", exc)
        raise RuntimeError(
            "AI analysis is temporarily unavailable. Please try again."
        ) from exc

    try:
        parsed   = _extract_json(raw_text)
        validated = _validate_response(parsed)
        return validated
    except ValueError as exc:
        logger.error("Failed to parse Gemini JSON: %s", exc)
        raise RuntimeError(
            "AI returned an unexpected response format. Please try again."
        ) from exc
