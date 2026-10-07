import { getSentimentMeta } from './sentimentUtils';
import { Tag, Quote } from 'lucide-react';

/**
 * Table + cards showing each extracted aspect and its sentiment.
 */
export default function AspectAnalysis({ aspects }) {
  if (!aspects || aspects.length === 0) return null;

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <Tag size={16} className="text-purple-400" />
        </div>
        <p className="text-xs font-semibold text-[#6b6f8a] uppercase tracking-widest">
          Aspect Analysis
        </p>
        <span className="ml-auto text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
          {aspects.length} aspect{aspects.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              <th className="text-left px-4 py-3 text-[#6b6f8a] font-semibold text-xs uppercase tracking-wider">Aspect</th>
              <th className="text-left px-4 py-3 text-[#6b6f8a] font-semibold text-xs uppercase tracking-wider">Sentiment</th>
              <th className="text-left px-4 py-3 text-[#6b6f8a] font-semibold text-xs uppercase tracking-wider">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {aspects.map((item, idx) => {
              const meta = getSentimentMeta(item.sentiment);
              return (
                <tr
                  key={idx}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/3 transition-colors"
                >
                  <td className="px-4 py-3.5 font-semibold text-white">{item.aspect}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${meta.className}`}>
                      {meta.emoji} {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[#a5a8c0] italic text-xs">
                    {item.evidence ? (
                      <span className="flex items-start gap-1">
                        <Quote size={10} className="shrink-0 mt-0.5 opacity-50" />
                        {item.evidence}
                      </span>
                    ) : (
                      <span className="text-[#6b6f8a]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3">
        {aspects.map((item, idx) => {
          const meta = getSentimentMeta(item.sentiment);
          return (
            <div key={idx} className="rounded-xl border border-white/8 bg-white/3 p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="font-semibold text-white">{item.aspect}</span>
                <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${meta.className}`}>
                  {meta.emoji} {meta.label}
                </span>
              </div>
              {item.evidence && (
                <p className="text-[#a5a8c0] italic text-xs flex items-start gap-1">
                  <Quote size={10} className="shrink-0 mt-0.5 opacity-50" />
                  {item.evidence}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
