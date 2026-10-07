import { CheckCircle2, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

/**
 * Displays the strengths and weaknesses side by side.
 */
export default function StrengthsWeaknesses({ strengths = [], weaknesses = [] }) {
  if (strengths.length === 0 && weaknesses.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 gap-4 animate-slide-up">
      {/* Strengths */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <ThumbsUp size={15} className="text-green-400" />
          </div>
          <p className="text-xs font-semibold text-[#6b6f8a] uppercase tracking-widest">
            Strengths
          </p>
          <span className="ml-auto text-xs font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
            {strengths.length}
          </span>
        </div>

        {strengths.length === 0 ? (
          <p className="text-sm text-[#6b6f8a] italic">No strengths identified.</p>
        ) : (
          <ul className="space-y-2.5">
            {strengths.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 group">
                <CheckCircle2
                  size={16}
                  className="shrink-0 mt-0.5 text-green-400 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm text-[#d4d4f0] leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Weaknesses */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <ThumbsDown size={15} className="text-red-400" />
          </div>
          <p className="text-xs font-semibold text-[#6b6f8a] uppercase tracking-widest">
            Weaknesses
          </p>
          <span className="ml-auto text-xs font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
            {weaknesses.length}
          </span>
        </div>

        {weaknesses.length === 0 ? (
          <p className="text-sm text-[#6b6f8a] italic">No weaknesses identified.</p>
        ) : (
          <ul className="space-y-2.5">
            {weaknesses.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 group">
                <XCircle
                  size={16}
                  className="shrink-0 mt-0.5 text-red-400 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm text-[#d4d4f0] leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
