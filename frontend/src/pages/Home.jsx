import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  FileText,
  AlertTriangle,
  ArrowRight,
  Zap,
  BookOpen,
  GraduationCap,
  Download,
  History,
  CheckCircle,
  Eye,
  Lock,
  Users,
  TrendingUp,
  LayoutDashboard,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { authService } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      tab: 'ai-analysis',
      tag: 'Local AI Engine',
      desc: 'Deep multi-layer parsing detects obligations, frequently contacted people, interaction frequency, and communication trends.',
      actionText: 'Launch AI Analyzer',
    },
    {
      icon: Users,
      title: 'Contact Analysis',
      tab: 'contacts',
      tag: 'Directory & Management',
      desc: 'Complete workflow to import, add, filter, and track recruiters, faculty guides, peers, and internship mentors.',
      actionText: 'Open Contact Manager',
    },
    {
      icon: TrendingUp,
      title: 'Smart Insights',
      tab: 'insights',
      tag: 'Communication Patterns',
      desc: 'Visual breakdown of network health, active vs inactive contact ratios, and category engagement distribution.',
      actionText: 'View Insights',
    },
    {
      icon: LayoutDashboard,
      title: 'Student Dashboard',
      tab: 'overview',
      tag: 'Executive Command Center',
      desc: 'Centralized view monitoring contact activity, follow-up deadlines, network metrics, and contract statuses.',
      actionText: 'Go to Dashboard',
    },
    {
      icon: ShieldAlert,
      title: 'Risk/Pattern Detection',
      tab: 'risks',
      tag: 'Relationship Health',
      desc: 'Instantly identifies cold contacts, high-priority relationships at risk of ghosting, and duplicate records.',
      actionText: 'Detect Risks',
    },
    {
      icon: FileText,
      title: 'Reports & Analytics',
      tab: 'reports',
      tag: 'Export & Audit',
      desc: 'Generates structured contact summaries, printable reports, and CSV exports for academic and placement tracking.',
      actionText: 'Generate Reports',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Import & Add',
      desc: 'Add contacts manually, upload CSV files, or load realistic student demo datasets.',
    },
    {
      step: '02',
      title: 'Process Data',
      desc: 'Local AI engine categorizes relationships, tracks dates, and evaluates interaction cadence.',
    },
    {
      step: '03',
      title: 'Spot Risks & Insights',
      desc: 'Identify cold connections, duplicate entries, and high-priority mentors needing outreach.',
    },
    {
      step: '04',
      title: 'Action & Decide',
      desc: 'Stay on top of critical internship deadlines, faculty recommendations, and signed agreements.',
    },
  ];

  const handleCardClick = (feat) => {
    if (authService.isAuthenticated()) {
      navigate(`/dashboard?tab=${feat.tab}`);
    } else {
      navigate('/login', {
        state: {
          from: { pathname: `/dashboard` },
          message: `Please sign in to access ${feat.title}.`,
        },
      });
    }
  };

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-8 overflow-hidden">
        {/* Ambient violet glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-xs sm:text-sm font-medium text-violet-300 shadow-md shadow-violet-950/50">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span>AI Contact & Agreement Intelligence for Students</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15]">
            Understand Your Network & Agreements{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Before You Commit.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-gray-300 leading-relaxed font-normal">
            A comprehensive student intelligence platform. Manage faculty and recruiter communications, analyze contact patterns, detect idle relationships, and parse complex contracts — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-violet-400/40 shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <LayoutDashboard className="w-5 h-5 text-violet-200" />
                <span>Open Student Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-violet-400/40 shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 text-violet-200" />
                <span>Get Started — Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            )}

            <Link
              to="/analyzer"
              className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-medium text-gray-300 hover:text-white bg-[#0e0e17] hover:bg-violet-950/30 border border-violet-500/20 hover:border-violet-500/40 transition-all flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4 text-violet-400" />
              <span>Contract Analyzer</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-mono">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-violet-400" />
              <span>Active Contact Intelligence</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-violet-400" />
              <span>Pattern & Duplicate Detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-violet-400" />
              <span>100% Privacy-Preserving</span>
            </div>
          </div>

          {/* AI/Document Illustration Card */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="p-1 rounded-2xl bg-gradient-to-b from-violet-500/30 via-violet-950/20 to-transparent shadow-2xl shadow-violet-950/40">
              <div className="bg-[#090910] rounded-xl p-5 sm:p-8 border border-violet-500/20 text-left space-y-4">
                
                <div className="flex items-center justify-between border-b border-violet-900/30 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs font-mono text-gray-400">Student_Intelligence_Engine.live</span>
                  </div>
                  <span className="text-[10px] font-mono text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-500/20">
                    Active & Operational
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Contact Relationship Alert</span>
                    </span>
                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                      "Dr. Ramesh Kulkarni (Thesis Guide) has had no interactions in 42 days. Recommendation letter submission is due in 3 weeks."
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/30 space-y-2">
                    <span className="text-[11px] font-mono text-violet-300 uppercase tracking-wider font-semibold flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-violet-400" />
                      <span>AI Suggested Outreach Action</span>
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed font-medium">
                      Send a drafted progress update email with your draft proposal to schedule a 10-minute thesis consultation.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Cards Grid (Designed Specifically for Students) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs text-violet-300 font-mono">
            <span>Interactive Tools</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Designed Specifically for Students
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Click on any module below to launch the functional analyzer, inspect your network data, and view real-time AI-generated insights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onClick={() => handleCardClick(feat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCardClick(feat)}
                className="group bg-[#0b0b14]/80 p-6 rounded-2xl border border-violet-500/20 hover:border-violet-500/60 glass-panel glass-panel-hover flex flex-col justify-between space-y-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 text-left relative overflow-hidden"
              >
                {/* Subtle card glow on hover */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-violet-600/10 rounded-full blur-2xl group-hover:bg-violet-600/25 transition-all" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-400 transition-all duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950/70 text-violet-300 border border-violet-500/20">
                      {feat.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-violet-900/30 flex items-center justify-between text-xs font-semibold text-violet-400 group-hover:text-violet-300 relative z-10">
                  <span>{feat.actionText}</span>
                  <div className="w-6 h-6 rounded-full bg-violet-950/60 border border-violet-500/30 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs text-violet-300 font-mono">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            From raw contact import to actionable communication analysis in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-[#090910] p-6 rounded-2xl border border-violet-900/30 relative flex flex-col justify-between space-y-4 hover:border-violet-500/30 transition-all"
            >
              <span className="text-3xl font-extrabold text-violet-400 font-mono opacity-80">
                {st.step}
              </span>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{st.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prominent Disclaimer Banner */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/30 to-black border border-violet-500/30 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-violet-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Educational & Informational Disclaimer
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              "This platform provides student contact intelligence and agreement analysis for informational purposes. Contacts and documents are analyzed locally or securely processed according to your configurations."
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-violet-900/20 to-black border border-violet-500/30 space-y-6 relative overflow-hidden">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to take control of your student network?
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
              Track contacts, evaluate internship offers, and eliminate communication bottlenecks in seconds.
            </p>
          </div>
          <div>
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started Now — It’s Free'}</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
