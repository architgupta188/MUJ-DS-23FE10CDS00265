/**
 * Full-page loading skeleton shown while the analysis request is in flight.
 */
export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in" aria-label="Loading analysis results">
      {/* Row 1: two cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass-card p-6 space-y-4">
          <div className="shimmer h-3 w-32 rounded-full" />
          <div className="shimmer h-12 w-48 rounded-2xl" />
          <div className="space-y-2.5">
            <div className="shimmer h-2 rounded-full" />
            <div className="shimmer h-2 rounded-full w-4/5" />
            <div className="shimmer h-2 rounded-full w-3/5" />
          </div>
        </div>
        <div className="glass-card p-6 space-y-4">
          <div className="shimmer h-3 w-24 rounded-full" />
          <div className="shimmer h-4 rounded-full" />
          <div className="shimmer h-4 rounded-full w-4/5" />
          <div className="shimmer h-4 rounded-full w-3/5" />
          <div className="shimmer h-4 rounded-full w-2/5" />
        </div>
      </div>
      {/* Row 2: wide card */}
      <div className="glass-card p-6 space-y-3">
        <div className="shimmer h-3 w-28 rounded-full" />
        <div className="shimmer h-4 rounded-full" />
        <div className="shimmer h-4 rounded-full w-11/12" />
        <div className="shimmer h-4 rounded-full w-3/4" />
      </div>
      {/* Row 3: two cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="glass-card p-6 space-y-3">
            <div className="shimmer h-3 w-24 rounded-full" />
            {[0, 1, 2].map((j) => (
              <div key={j} className="flex items-center gap-2">
                <div className="shimmer w-4 h-4 rounded-full shrink-0" />
                <div className="shimmer h-3 rounded-full flex-1" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
