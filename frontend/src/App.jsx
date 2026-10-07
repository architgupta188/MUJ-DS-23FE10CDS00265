import { useState, useRef } from 'react';
import Header              from './components/Header';
import ReviewInput         from './components/ReviewInput';
import SentimentCard       from './components/SentimentCard';
import SummaryCard         from './components/SummaryCard';
import AspectAnalysis      from './components/AspectAnalysis';
import AspectChart         from './components/AspectChart';
import StrengthsWeaknesses from './components/StrengthsWeaknesses';
import ErrorBanner         from './components/ErrorBanner';
import LoadingSkeleton     from './components/LoadingSkeleton';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState('');
  const resultsRef = useRef(null);

  async function handleAnalyze(review) {
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/analyze-review`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ review }),
      });

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error('AI analysis is temporarily unavailable. Please try again in a moment.');
        }
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error (${response.status}). Please try again.`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed. Please try again.');
      }

      setResult(data);

      // Scroll to results smoothly
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError(
          'Cannot connect to the backend server. Make sure the FastAPI backend is running on port 8000.'
        );
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* Hero */}
        <div className="text-center py-10 sm:py-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-xs font-medium text-indigo-300 mb-6">
            🎓 NLP Capstone Project · B.Tech Data Science
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            AI-Powered{' '}
            <span className="gradient-text">Product Review</span>
            <br />
            Intelligence
          </h2>
          <p className="text-[#a5a8c0] text-lg max-w-2xl mx-auto leading-relaxed">
            Analyze product reviews using <strong className="text-indigo-400">VADER NLP</strong>{' '}
            for baseline sentiment and{' '}
            <strong className="text-purple-400">Google Gemini AI</strong> for deep aspect
            extraction, summaries, and insights.
          </p>
        </div>

        {/* Review Input */}
        <ReviewInput onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Loading skeleton */}
        {isLoading && (
          <div className="mt-6">
            <LoadingSkeleton />
          </div>
        )}

        {/* Error banner */}
        {error && !isLoading && (
          <div className="mt-6">
            <ErrorBanner
              message={error}
              onRetry={() => setError('')}
            />
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div ref={resultsRef} className="mt-6 space-y-4">
            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest px-3">
                Analysis Results
              </span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-indigo-500/30 to-transparent" />
            </div>

            {/* Row: Sentiment + Summary */}
            <div className="grid sm:grid-cols-2 gap-4">
              <SentimentCard sentiment={result.sentiment} />
              <SummaryCard   summary={result.summary} />
            </div>

            {/* Aspect table */}
            <AspectAnalysis aspects={result.aspects} />

            {/* Strengths + Weaknesses */}
            <StrengthsWeaknesses
              strengths={result.strengths}
              weaknesses={result.weaknesses}
            />

            {/* Chart */}
            <AspectChart aspects={result.aspects} />

            {/* Footer note */}
            <p className="text-center text-[11px] text-[#6b6f8a] py-4">
              Traditional NLP (VADER) + LLM-based NLP (Gemini AI) · Results based solely on the provided review text
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center">
        <p className="text-xs text-[#6b6f8a]">
          ReviewRadar — NLP Capstone Project · Built with React, FastAPI, VADER & Google Gemini AI
        </p>
      </footer>
    </div>
  );
}
