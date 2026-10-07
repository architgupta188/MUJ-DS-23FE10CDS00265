import { getSentimentMeta } from './sentimentUtils';
import { TrendingUp, TrendingDown, Minus, Shuffle } from 'lucide-react';

const ICON_MAP = {
  positive: TrendingUp,
  negative: TrendingDown,
  neutral:  Minus,
  mixed:    Shuffle,
};

/**
 * Displays the overall sentiment label as a large, styled card.
 */
export default function SentimentCard({ sentiment }) {
  const meta   = getSentimentMeta(sentiment.label);
  const Icon   = ICON_MAP[sentiment.label] || Minus;
  const score  = sentiment.compound ?? 0;
  const pct    = Math.min(100, Math.round(Math.abs(score) * 100));

  return (
    <div className="glass-card p-6 animate-slide-up">
      <p className="text-xs font-semibold text-[#6b6f8a] uppercase tracking-widest mb-4">
        Overall Sentiment
      </p>

      {/* Big label */}
      <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl border mb-5 ${meta.className}`}>
        <Icon size={22} />
        <span className="text-2xl font-black tracking-wide uppercase">{meta.label}</span>
        <span className="text-xl">{meta.emoji}</span>
      </div>

      {/* VADER scores */}
      <div className="space-y-2 mb-4">
        <ScoreBar label="Positive" value={sentiment.positive ?? 0} color="#4ade80" />
        <ScoreBar label="Negative" value={sentiment.negative ?? 0} color="#f87171" />
        <ScoreBar label="Neutral"  value={sentiment.neutral  ?? 0} color="#facc15" />
      </div>

      {/* Compound */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#a5a8c0]">VADER Compound Score</span>
          <span
            className="font-mono font-bold text-base"
            style={{ color: meta.color }}
          >
            {score >= 0 ? '+' : ''}{score.toFixed(3)}
          </span>
        </div>
        <p className="text-[10px] text-[#6b6f8a] mt-1">
          Range: −1.0 (most negative) to +1.0 (most positive) · Model analysis score, not scientific certainty
        </p>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-16 text-[#a5a8c0] shrink-0">{label}</span>
      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-10 text-right font-mono text-[#6b6f8a]">{pct}%</span>
    </div>
  );
}
