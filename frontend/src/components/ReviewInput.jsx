import { useState } from 'react';
import { Send, Loader2, Sparkles, RotateCcw } from 'lucide-react';

// Sample reviews for quick loading
const SAMPLE_REVIEWS = [
  `The camera quality is excellent and the display looks amazing, but the battery drains very quickly and the phone gets uncomfortably hot while gaming.`,
  `The laptop's performance is outstanding — boots in seconds and handles heavy workloads. The display is gorgeous with vivid colors. However, the fan gets really loud under load and the laptop heats up significantly during extended use.`,
  `Sound quality on these headphones is absolutely top-notch with deep, rich bass. Noise cancellation is impressive. However, the ear cushions start to feel uncomfortable after about an hour and the build quality feels a bit cheap for the price.`,
  `I'm genuinely impressed with the battery life — it lasted a full week on a single charge. The fitness tracking is accurate and the display is crisp and bright even in direct sunlight. Very happy with this purchase.`,
];

export default function ReviewInput({ onAnalyze, isLoading }) {
  const [review, setReview] = useState('');
  const [error, setError]   = useState('');

  const charCount = review.length;
  const isOverLimit = charCount > 3000;

  function handleSubmit() {
    const trimmed = review.trim();
    if (!trimmed) {
      setError('Please enter a product review before analyzing.');
      return;
    }
    if (trimmed.split(/\s+/).length < 5) {
      setError('Please enter a more detailed review (at least a few sentences).');
      return;
    }
    if (isOverLimit) {
      setError('Review is too long. Please keep it under 3000 characters.');
      return;
    }
    setError('');
    onAnalyze(trimmed);
  }

  function loadSample() {
    const random = SAMPLE_REVIEWS[Math.floor(Math.random() * SAMPLE_REVIEWS.length)];
    setReview(random);
    setError('');
  }

  function handleClear() {
    setReview('');
    setError('');
  }

  return (
    <section className="glass-card p-6 sm:p-8 animate-fade-in">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Analyze a Product Review
        </h2>
        <p className="text-[#a5a8c0] text-sm leading-relaxed">
          Paste any product review below. Our system uses{' '}
          <span className="text-indigo-400 font-medium">VADER NLP</span> for baseline sentiment
          and <span className="text-purple-400 font-medium">Google Gemini AI</span> for deep
          aspect-level analysis, summaries, and insights.
        </p>
      </div>

      {/* Textarea */}
      <div className="relative mb-3">
        <textarea
          id="review-input"
          className="review-textarea min-h-[180px]"
          placeholder="Paste your product review here...&#10;&#10;Example: &quot;The camera quality is excellent but the battery drains too fast...&quot;"
          value={review}
          onChange={(e) => { setReview(e.target.value); setError(''); }}
          disabled={isLoading}
          aria-label="Product review input"
          rows={8}
        />
        {/* Character count */}
        <div className={`absolute bottom-3 right-4 text-xs font-mono tabular-nums ${
          isOverLimit ? 'text-red-400' : 'text-[#6b6f8a]'
        }`}>
          {charCount} / 3000
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          id="input-error"
          className="mb-4 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm flex items-start gap-2 animate-fade-in"
          role="alert"
        >
          <span className="mt-0.5">⚠️</span>
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Analyze button */}
        <button
          id="analyze-btn"
          className="btn-primary flex-1 sm:flex-none justify-center"
          onClick={handleSubmit}
          disabled={isLoading || isOverLimit}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Analyze Review
            </>
          )}
        </button>

        {/* Load sample */}
        <button
          id="sample-btn"
          onClick={loadSample}
          disabled={isLoading}
          className="px-4 py-3 rounded-xl text-sm font-medium text-indigo-300 border border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/15 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          title="Load a sample review"
        >
          <Send size={15} />
          Sample Review
        </button>

        {/* Clear */}
        {review && (
          <button
            id="clear-btn"
            onClick={handleClear}
            disabled={isLoading}
            className="px-4 py-3 rounded-xl text-sm font-medium text-[#6b6f8a] border border-white/10 hover:text-white hover:border-white/20 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            title="Clear input"
          >
            <RotateCcw size={15} />
            Clear
          </button>
        )}
      </div>

      {/* Loading hint */}
      {isLoading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#a5a8c0] animate-pulse-slow">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          Running VADER sentiment analysis and calling Gemini AI…
        </div>
      )}
    </section>
  );
}
