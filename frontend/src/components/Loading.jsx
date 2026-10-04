import React, { useState, useEffect } from 'react';
import { Sparkles, FileSearch, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

const stages = [
  { label: 'Reading your agreement...', detail: 'Extracting clean text and preserving page indexes' },
  { label: 'Extracting important clauses...', detail: 'Scanning 21 student contract categories via AI' },
  { label: 'Analyzing obligations...', detail: 'Mapping penalties, notice periods, payments, and restrictions' },
  { label: 'Preparing your summary...', detail: 'Formatting student-friendly explanations and generating dashboard' },
];

export default function Loading({ filename = 'Agreement.pdf' }) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[450px] flex flex-col items-center justify-center p-8 bg-[#0a0a10]/80 rounded-2xl border border-violet-500/30 glass-panel shadow-2xl relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none animate-subtle-pulse" />
      
      {/* Central Animated Spinner */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-2 border-violet-500/20 border-t-violet-500 border-r-indigo-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-violet-950/80 border border-violet-400/40 flex items-center justify-center shadow-lg shadow-violet-600/30">
            <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Title & Document Badge */}
      <div className="text-center space-y-2 mb-8 z-10">
        <h3 className="text-2xl font-bold text-white tracking-tight">
          AI Contract Intelligence Engine
        </h3>
        <p className="text-sm text-gray-400">
          Analyzing <span className="text-violet-300 font-semibold">{filename}</span> for student-critical clauses
        </p>
      </div>

      {/* Multi-stage Progress Stepper */}
      <div className="w-full max-w-md space-y-3 z-10">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          return (
            <div
              key={stage.label}
              className={`flex items-center space-x-3 p-3 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-violet-900/30 border-violet-500/50 shadow-md shadow-violet-500/20'
                  : isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-gray-300'
                  : 'bg-black/20 border-white/5 opacity-40'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center text-[10px] text-gray-400">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isCurrent ? 'text-white' : isDone ? 'text-gray-200' : 'text-gray-400'}`}>
                  {stage.label}
                </p>
                <p className="text-xs text-gray-400 truncate">{stage.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-xs text-violet-400/80 font-mono tracking-wider flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
        <span>Parsing with PyMuPDF & AI Clause Intelligence</span>
      </div>

    </div>
  );
}
