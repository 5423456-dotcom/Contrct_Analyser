import React from 'react';
import { Sparkles, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function SummaryCard({ summary, overallDuration, keyPoints = [], pageCount = 1, findingsCount = 0 }) {
  return (
    <div className="bg-[#0b0b13]/80 rounded-2xl border border-violet-500/25 p-6 sm:p-8 glass-panel violet-glow relative overflow-hidden">
      
      {/* Background soft ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-violet-900/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Executive Summary</h2>
            <p className="text-xs text-violet-300/80">Simplified overview tailored for students</p>
          </div>
        </div>

        {/* Quick pill stats */}
        <div className="flex items-center space-x-2">
          {overallDuration && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs text-violet-300">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span>Duration: {overallDuration}</span>
            </div>
          )}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>{pageCount} {pageCount === 1 ? 'Page' : 'Pages'}</span>
          </div>
        </div>
      </div>

      {/* Main Summary Paragraph */}
      <div className="mt-5">
        <p className="text-gray-200 text-base sm:text-lg leading-relaxed font-normal">
          {summary}
        </p>
      </div>

      {/* Key Highlights Bullet Points */}
      {keyPoints && keyPoints.length > 0 && (
        <div className="mt-6 pt-5 border-t border-violet-900/20">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-violet-400 mb-3">
            Key Attention Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-violet-950/20 border border-violet-500/15"
              >
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-gray-300 leading-snug">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
