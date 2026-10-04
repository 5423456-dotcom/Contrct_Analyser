import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, FileText, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function FindingCard({ finding, index }) {
  const [showOriginal, setShowOriginal] = useState(false);

  const getImportanceBadge = (imp) => {
    switch (imp) {
      case 'High':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'Low':
      default:
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
    }
  };

  const badge = getImportanceBadge(finding.importance);

  return (
    <div className="bg-[#0b0b14]/90 rounded-2xl border border-violet-500/20 p-5 sm:p-6 glass-panel glass-panel-hover transition-all space-y-4">
      
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-mono font-bold text-violet-400 bg-violet-950/50 px-2.5 py-1 rounded-lg border border-violet-500/25">
            #{index}
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400 bg-black/40 px-3 py-1 rounded-lg border border-white/5">
            {finding.category}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Importance Badge */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${badge.bg}`}>
            <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
            <span>{finding.importance} Attention</span>
          </div>

          {/* Page Number */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/40 border border-violet-500/20 text-xs text-gray-300 font-mono">
            <FileText className="w-3 h-3 text-violet-400" />
            <span>Page {finding.page_number}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <h4 className="text-lg font-bold text-white tracking-tight">
          {finding.title}
        </h4>
      </div>

      {/* Simple Student-Friendly Explanation */}
      <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-1.5">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-violet-300 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Student-Friendly Explanation</span>
        </div>
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
          {finding.simple_explanation}
        </p>
      </div>

      {/* Expandable Original Clause Drawer */}
      <div className="pt-1">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="flex items-center justify-between w-full p-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <BookOpen className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-medium">
              {showOriginal ? 'Hide Original Contract Language' : 'View Original Contract Language'}
            </span>
          </div>
          {showOriginal ? <ChevronUp className="w-4 h-4 text-violet-400" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showOriginal && (
          <div className="mt-3 p-4 rounded-xl bg-[#07070b] border border-violet-900/40 text-xs text-gray-300 font-mono leading-relaxed space-y-2">
            <div className="flex items-center justify-between text-[11px] text-gray-400 border-b border-gray-800 pb-2">
              <span>Original Verbatim Text (Extracted from Page {finding.page_number})</span>
            </div>
            <p className="whitespace-pre-wrap text-gray-300 italic">
              "{finding.original_clause}"
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
