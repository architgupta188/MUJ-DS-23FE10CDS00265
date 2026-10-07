/**
 * Sentiment metadata — maps sentiment label to display properties.
 */
export const SENTIMENT_META = {
  positive: {
    label:     'Positive',
    emoji:     '🟢',
    className: 'sentiment-positive',
    color:     '#22c55e',
    barColor:  '#4ade80',
  },
  negative: {
    label:     'Negative',
    emoji:     '🔴',
    className: 'sentiment-negative',
    color:     '#ef4444',
    barColor:  '#f87171',
  },
  neutral: {
    label:     'Neutral',
    emoji:     '🟡',
    className: 'sentiment-neutral',
    color:     '#eab308',
    barColor:  '#facc15',
  },
  mixed: {
    label:     'Mixed',
    emoji:     '🟣',
    className: 'sentiment-mixed',
    color:     '#a855f7',
    barColor:  '#c084fc',
  },
};

/**
 * Returns the SENTIMENT_META entry for a given label (case-insensitive).
 * Falls back to neutral if unrecognised.
 */
export function getSentimentMeta(label) {
  return SENTIMENT_META[(label || 'neutral').toLowerCase()] || SENTIMENT_META.neutral;
}
