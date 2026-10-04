import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Users,
  Code,
  GraduationCap,
  BookOpen,
  Server,
  Layers,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function About() {
  const targetUsers = [
    { title: 'College Students', desc: 'Signing college internship agreements, non-disclosure agreements, and campus job offers.' },
    { title: 'Internship Seekers', desc: 'Evaluating unpaid vs stipend terms, mandatory lock-ins, and early exit penalties.' },
    { title: 'Job Applicants', desc: 'Reviewing probation rules, notice periods, and restrictive non-compete clauses.' },
    { title: 'Freelancers & Gig Workers', desc: 'Navigating intellectual property ownership, milestone payments, and revisions.' },
    { title: 'PG / Hostel Students', desc: 'Checking security deposit deductions, curfew policies, and utility bill clauses.' },
    { title: 'Course & Subscription Users', desc: 'Understanding recurring auto-renewals, refund policies, and cancellation windows.' },
  ];

  const techStack = [
    { area: 'Frontend', tech: 'React 18, Vite, React Router, Tailwind CSS, Lucide Icons' },
    { area: 'Backend API', tech: 'Python 3.10+, FastAPI, Uvicorn, Pydantic' },
    { area: 'PDF Extraction', tech: 'PyMuPDF (fitz) - Page preserving text & layout parser' },
    { area: 'Database Storage', tech: 'MongoDB with Motor async driver' },
    { area: 'AI Clause Extraction', tech: 'Gemini 1.5 Flash API + Intelligent 21-Category Fallback Heuristics' },
    { area: 'Report Generation', tech: 'ReportLab PDF document builder' },
    { area: 'Authentication', tech: 'Bcrypt password hashing + JWT authentication' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs text-violet-300 font-mono">
          <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
          <span>Capstone Project Showcase</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About ContractAI
        </h1>
        <p className="text-base text-gray-400 max-w-2xl mx-auto">
          AI-Powered Student Contract Analyzer designed to bridge the gap between dense legal contracts and student clarity.
        </p>
      </div>

      {/* College Project Badge Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-900/30 via-indigo-900/20 to-black border border-violet-500/30 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600/30 border border-violet-400/40 flex items-center justify-center text-violet-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Built as a College Real-World Project</h3>
            <p className="text-xs text-violet-300">Advanced Agentic Architecture & NLP Contract Intelligence</p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-violet-950/80 text-violet-300 border border-violet-500/30">
          v1.0.0 Production Build
        </span>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* The Problem */}
        <div className="p-6 rounded-2xl bg-[#0a0a12] border border-rose-500/20 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">The Real-World Problem</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Students and young graduates routinely sign binding contracts without reading or understanding the terms. Dense legal jargon, multi-page PDFs, and hidden covenants lead students into harsh lock-in clauses, high financial penalties, non-refundable security deposits, or non-competes that limit their careers.
          </p>
        </div>

        {/* The Solution */}
        <div className="p-6 rounded-2xl bg-[#0a0a12] border border-violet-500/30 space-y-4 shadow-lg shadow-violet-950/20">
          <div className="w-10 h-10 rounded-xl bg-violet-950/50 border border-violet-500/40 flex items-center justify-center text-violet-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">The ContractAI Solution</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            ContractAI acts as an intelligent student advocate. Rather than giving vague summaries, it rigorously extracts student obligations across 21 critical dimensions — highlighting what you must pay, when you must give notice, what penalties apply if you leave early, and translates each clause into plain English.
          </p>
        </div>

      </div>

      {/* Target Users */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-violet-400">
          <Users className="w-5 h-5" />
          <h2 className="text-xl font-bold text-white">Who Is ContractAI Built For?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {targetUsers.map((user, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#090910] border border-violet-900/30 space-y-2 hover:border-violet-500/40 transition-colors"
            >
              <h4 className="text-sm font-bold text-violet-300">{user.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{user.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Architecture */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-violet-400">
          <Server className="w-5 h-5" />
          <h2 className="text-xl font-bold text-white">Technical Architecture & Stack</h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-violet-900/40 bg-[#090910]">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-violet-950/40 text-xs uppercase font-semibold text-violet-300 border-b border-violet-900/40">
              <tr>
                <th className="px-6 py-3.5">Component Layer</th>
                <th className="px-6 py-3.5">Technologies & Implementation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono text-xs">
              {techStack.map((item, idx) => (
                <tr key={idx} className="hover:bg-violet-950/10">
                  <td className="px-6 py-3.5 font-semibold text-white whitespace-nowrap">{item.area}</td>
                  <td className="px-6 py-3.5 text-gray-300">{item.tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Non-Legal Advice Disclaimer */}
      <div className="p-6 rounded-2xl bg-black/60 border border-violet-500/30 space-y-3">
        <h4 className="text-sm font-bold text-violet-300 uppercase tracking-wider flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-violet-400" />
          <span>Legal Disclaimer & Limitation of Liability</span>
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          ContractAI is not a law firm and does not provide legal representation, legal advice, or formal legal opinions. The AI-generated assessments and translations provided by this platform are strictly for educational and informational purposes to help students spot areas where clarification is needed. Users should review their actual contractual documents thoroughly or seek independent legal counsel before signing.
        </p>
      </div>

    </div>
  );
}
