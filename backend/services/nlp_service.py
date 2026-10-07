"""
NLP Service — ReviewRadar
=========================
Handles text preprocessing and VADER sentiment analysis.

Traditional NLP pipeline:
  1. Preprocess (remove URLs, HTML, normalise whitespace)
  2. Tokenize (NLTK punkt, with regex fallback)
  3. Remove stopwords & punctuation
  4. Compute VADER sentiment scores
  5. Classify compound score into a label
"""

import re
import string
import logging

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

logger = logging.getLogger(__name__)

# ─── NLTK Setup (with graceful fallback) ─────────────────────────────────────

_NLTK_AVAILABLE = False
_STOPWORDS: set[str] = set()

def _setup_nltk() -> None:
    """
    Try to set up NLTK punkt tokeniser and stopwords.
    Falls back gracefully to regex tokenisation if NLTK data is unavailable.
    """
    global _NLTK_AVAILABLE, _STOPWORDS
    try:
        import nltk
        # Try to ensure data is available
        resources = [
            ('tokenizers/punkt',     'punkt'),
            ('tokenizers/punkt_tab', 'punkt_tab'),
            ('corpora/stopwords',    'stopwords'),
        ]
        for path, name in resources:
            try:
                nltk.data.find(path)
            except LookupError:
                logger.info("Downloading NLTK resource: %s", name)
                nltk.download(name, quiet=True)

        # Verify we can actually use them
        from nltk.tokenize import word_tokenize
        from nltk.corpus import stopwords as sw
        word_tokenize("test sentence")          # will raise if punkt missing
        _STOPWORDS = set(sw.words('english'))
        _NLTK_AVAILABLE = True
        logger.info("NLTK tokeniser ready.")
    except Exception as exc:
        logger.warning(
            "NLTK punkt not available (%s). Using regex fallback tokeniser.", exc
        )
        # Minimal English stopwords for the fallback
        _STOPWORDS = {
            'i','me','my','myself','we','our','ours','ourselves','you',"you're",
            "you've","you'll","you'd",'your','yours','yourself','yourselves','he',
            'him','his','himself','she',"she's",'her','hers','herself','it',"it's",
            'its','itself','they','them','their','theirs','themselves','what','which',
            'who','whom','this','that',"that'll",'these','those','am','is','are','was',
            'were','be','been','being','have','has','had','having','do','does','did',
            'doing','a','an','the','and','but','if','or','because','as','until',
            'while','of','at','by','for','with','about','against','between','into',
            'through','during','before','after','above','below','to','from','up',
            'down','in','out','on','off','over','under','again','further','then',
            'once','here','there','when','where','why','how','all','both','each',
            'few','more','most','other','some','such','no','nor','not','only','own',
            'same','so','than','too','very','s','t','can','will','just','don',
            "don't",'should',"should've",'now','d','ll','m','o','re','ve','y',
            "ain't","aren't","couldn't","didn't","doesn't","hadn't","hasn't",
            "haven't","isn't","mightn't","mustn't","needn't","shan't","shouldn't",
            "wasn't","weren't","won't","wouldn't",
        }
        _NLTK_AVAILABLE = False


_setup_nltk()


# ─── VADER Analyser (singleton) ───────────────────────────────────────────────

_analyser = SentimentIntensityAnalyzer()


# ─── Tokenisation helpers ────────────────────────────────────────────────────

def _tokenize(text: str) -> list[str]:
    """Tokenise text, using NLTK if available, regex otherwise."""
    if _NLTK_AVAILABLE:
        from nltk.tokenize import word_tokenize
        return word_tokenize(text)
    # Regex fallback: split on word boundaries
    return re.findall(r"\b[a-zA-Z']+\b", text)


# ─── Public API ──────────────────────────────────────────────────────────────

def preprocess_text(text: str) -> str:
    """
    Basic NLP preprocessing:
      - Strip whitespace
      - Remove URLs
      - Remove HTML tags
      - Collapse whitespace
    """
    text = text.strip()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text


def get_word_tokens(text: str) -> list[str]:
    """
    Tokenize text and remove stopwords + punctuation.
    Returns meaningful content words.
    """
    preprocessed = preprocess_text(text).lower()
    tokens = _tokenize(preprocessed)
    punct  = set(string.punctuation)
    filtered = [
        t for t in tokens
        if t not in _STOPWORDS
        and t not in punct
        and t.isalpha()
        and len(t) > 1
    ]
    return filtered


def analyse_sentiment(text: str) -> dict:
    """
    Run VADER sentiment analysis on the given text.

    Returns:
      {
        "positive":  float,   # proportion positive  (0–1)
        "negative":  float,   # proportion negative  (0–1)
        "neutral":   float,   # proportion neutral   (0–1)
        "compound":  float,   # compound score       (-1 to +1)
        "label":     str,     # "positive" | "negative" | "neutral" | "mixed"
      }

    Classification thresholds (VADER standard + mixed heuristic):
      compound >= 0.05  → Positive
      compound <= -0.05 → Negative
      otherwise         → Neutral

    Mixed: if both pos and neg proportions >= 0.15 and
           compound is between -0.35 and +0.35.
    """
    preprocessed = preprocess_text(text)
    scores = _analyser.polarity_scores(preprocessed)

    pos  = scores['pos']
    neg  = scores['neg']
    neu  = scores['neu']
    comp = scores['compound']

    if pos >= 0.15 and neg >= 0.15 and -0.35 <= comp <= 0.35:
        label = 'mixed'
    elif comp >= 0.05:
        label = 'positive'
    elif comp <= -0.05:
        label = 'negative'
    else:
        label = 'neutral'

    return {
        'positive': round(pos,  4),
        'negative': round(neg,  4),
        'neutral':  round(neu,  4),
        'compound': round(comp, 4),
        'label':    label,
    }
