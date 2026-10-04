import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Sparkles,
  Download,
  ArrowLeft,
  Search,
  Filter,
  Layers,
  AlertCircle,
  Clock,
  CheckCircle2,
  Share2,
  Printer
} from 'lucide-react';
import { analysisService } from '../services/api';
import SummaryCard from '../components/SummaryCard';
import ObligationCard from '../components/ObligationCard';
import FindingCard from '../components/FindingCard';
import ContractChat from '../components/ContractChat';

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImportance, setSelectedImportance] = useState('All');

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setLoading(true);
        const res = await analysisService.getAnalysis(id);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load analysis results.');
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [id]);

  const handleDownloadPdf = async () => {
    if (!data) return;
    try {
      setDownloading(true);
      await analysisService.downloadPdfReport(data.id || id, data.filename || 'Contract_Report.pdf');
    } catch (err) {
      alert('Failed to download PDF report: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Loading your contract analysis dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Analysis Not Found</h2>
        <p className="text-sm text-gray-400">{error || 'This contract analysis could not be located.'}</p>
        <Link
          to="/analyzer"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze a New Agreement</span>
        </Link>
      </div>
    );
  }

  const findings = data.findings || [];
  const categories = ['All', ...new Set(findings.map((f) => f.category))];

  const filteredFindings = findings.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.simple_explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.original_clause.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesImportance = selectedImportance === 'All' || f.importance === selectedImportance;
    return matchesSearch && matchesCategory && matchesImportance;
  });

  const formattedDate = data.created_at
    ? new Date(data.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recent';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-violet-900/30">
        <div className="space-y-2">
          <Link
            to="/analyzer"
            className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-violet-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Analyze another document</span>
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Agreement Analysis
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 pt-1">
            <span className="flex items-center space-x-1 text-violet-300 font-medium">
              <FileText className="w-3.5 h-3.5 text-violet-400" />
              <span>{data.filename}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{formattedDate}</span>
            </span>
            <span>•</span>
            <span>{data.page_count || 1} {data.page_count === 1 ? 'Page' : 'Pages'}</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">{findings.length} Conditions Identified</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-violet-400/40 shadow-lg shadow-violet-600/30 flex items-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* 1. Executive Summary Card */}
      <SummaryCard
        summary={data.summary}
        overallDuration={data.overall_duration}
        keyPoints={data.key_points}
        pageCount={data.page_count}
        findingsCount={findings.length}
      />

      {/* 2. Interactive "Ask ContractAI" Chatbot */}
      <ContractChat
        analysisId={data.id || id}
        filename={data.filename || 'Agreement'}
        summary={data.summary || ''}
        findings={findings}
      />

      {/* 3. Key Findings Quick Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-400/30 flex items-center justify-center text-violet-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Key Findings at a Glance</h3>
              <p className="text-xs text-gray-400">Important clauses that require student review</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            Showing top {Math.min(findings.length, 6)} conditions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {findings.slice(0, 6).map((f, idx) => {
            const isHigh = f.importance === 'High';
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border bg-[#0a0a12] ${
                  isHigh ? 'border-rose-500/30 shadow-sm shadow-rose-950/20' : 'border-violet-500/20'
                } space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-400 uppercase">{f.category}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isHigh
                        ? 'bg-rose-950/50 text-rose-300 border border-rose-500/30'
                        : 'bg-violet-950/50 text-violet-300 border border-violet-500/30'
                    }`}
                  >
                    {f.importance} Attention
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-tight">{f.title}</h4>
                <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">{f.simple_explanation}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. UNIQUE CORE FEATURE: Student Obligation Dashboard */}
      <ObligationCard obligations={data.student_obligations} />

      {/* 4. Detailed Findings with Filter & Search */}
      <div className="space-y-6 pt-6 border-t border-violet-900/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Detailed Findings</h3>
            <p className="text-xs text-gray-400">
              Side-by-side comparison between original contract clauses and student-friendly translations
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search findings..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-[#0e0e17] border border-violet-500/20 text-xs text-white focus:outline-none focus:border-violet-500 w-44"
              />
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#0e0e17] border border-violet-500/20 text-xs text-gray-300 focus:outline-none focus:border-violet-500"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0e0e17]">
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            {/* Importance Select */}
            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#0e0e17] border border-violet-500/20 text-xs text-gray-300 focus:outline-none focus:border-violet-500"
            >
              <option value="All">All Attention Levels</option>
              <option value="High">High Attention</option>
              <option value="Medium">Medium Attention</option>
              <option value="Low">Low Attention</option>
            </select>
          </div>
        </div>

        {/* Findings List */}
        {filteredFindings.length > 0 ? (
          <div className="space-y-4">
            {filteredFindings.map((f, idx) => (
              <FindingCard key={idx} finding={f} index={idx + 1} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#090910] border border-violet-900/30 text-center space-y-2">
            <p className="text-sm text-gray-400">No findings matched your filter or search query.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedImportance('All');
              }}
              className="text-xs text-violet-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
