import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';
import { BarChart2 } from 'lucide-react';
import { getSentimentMeta } from './sentimentUtils';

/**
 * Maps aspect sentiment to a numeric score for the chart.
 * positive → +1, negative → -1, neutral → 0, mixed → +0.2
 */
function sentimentToScore(sentiment) {
  const map = { positive: 1, negative: -1, neutral: 0, mixed: 0.2 };
  return map[(sentiment || 'neutral').toLowerCase()] ?? 0;
}

/** Custom bar label */
function CustomLabel({ x, y, width, value }) {
  const isPositive = value >= 0;
  return (
    <text
      x={x + width / 2}
      y={isPositive ? y - 6 : y + 16}
      textAnchor="middle"
      fill="#a5a8c0"
      fontSize={11}
      fontFamily="JetBrains Mono, monospace"
    >
      {value >= 0 ? `+${value.toFixed(1)}` : value.toFixed(1)}
    </text>
  );
}

/** Custom tooltip */
function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value, sentiment } = payload[0].payload;
  const meta = getSentimentMeta(sentiment);

  return (
    <div className="glass-card px-4 py-3 text-sm border border-white/15">
      <p className="font-semibold text-white mb-1">{name}</p>
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-semibold ${meta.className}`}>
        {meta.emoji} {meta.label}
      </span>
      <p className="text-[#6b6f8a] mt-1.5 text-xs font-mono">
        Score: {value >= 0 ? '+' : ''}{value.toFixed(1)}
      </p>
    </div>
  );
}

export default function AspectChart({ aspects }) {
  if (!aspects || aspects.length === 0) return null;

  const data = aspects.map((a) => ({
    name:      a.aspect,
    value:     sentimentToScore(a.sentiment),
    sentiment: a.sentiment,
  }));

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <BarChart2 size={16} className="text-indigo-400" />
        </div>
        <p className="text-xs font-semibold text-[#6b6f8a] uppercase tracking-widest">
          Aspect Sentiment Chart
        </p>
        <span className="ml-auto text-[10px] text-[#6b6f8a]">
          +1 = Positive · 0 = Neutral · −1 = Negative
        </span>
      </div>

      <ResponsiveContainer width="100%" height={Math.max(240, data.length * 52)}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          layout="vertical"
        >
          <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            type="number"
            domain={[-1.2, 1.2]}
            tickCount={5}
            tick={{ fill: '#6b6f8a', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            tick={{ fill: '#a5a8c0', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ReferenceLine x={0} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={32}>
            {data.map((entry, idx) => {
              const meta = getSentimentMeta(entry.sentiment);
              return <Cell key={idx} fill={meta.color} fillOpacity={0.85} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
