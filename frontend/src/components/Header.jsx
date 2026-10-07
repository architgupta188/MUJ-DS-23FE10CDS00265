import { Radar, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Radar size={20} className="text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0f0f1a] animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text leading-none">ReviewRadar</h1>
            <p className="text-xs text-[#6b6f8a] mt-0.5 font-medium">AI Product Review Intelligence</p>
          </div>
        </div>

        {/* Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border text-xs font-medium text-indigo-300">
          <Zap size={12} className="text-indigo-400" />
          Powered by Gemini + VADER
        </div>
      </div>
    </header>
  );
}
