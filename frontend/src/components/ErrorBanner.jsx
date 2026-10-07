import { AlertTriangle, WifiOff, RefreshCw } from 'lucide-react';

/**
 * Error banner shown when the backend or Gemini API fails.
 */
export default function ErrorBanner({ message, onRetry }) {
  return (
    <div
      id="error-banner"
      className="glass-card border border-red-500/25 bg-red-500/5 p-6 animate-fade-in"
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-red-300 mb-1">Analysis Failed</h3>
          <p className="text-sm text-red-400/80 leading-relaxed">{message}</p>
        </div>
      </div>

      {onRetry && (
        <div className="mt-4 flex justify-end">
          <button
            id="retry-btn"
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-300 border border-red-500/25 hover:bg-red-500/10 transition-colors"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
