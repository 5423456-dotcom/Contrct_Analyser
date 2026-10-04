import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-violet-900/40 bg-[#040406] text-gray-400 mt-24">
      {/* Disclaimer Banner */}
      <div className="bg-violet-950/20 border-b border-violet-900/30 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-start space-x-3 text-xs text-violet-300/80">
          <AlertCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-violet-300 font-semibold">Important Educational Disclaimer: </strong>
            This tool provides AI-generated explanations for educational and informational purposes only. It is not a substitute for professional legal advice. Always review full terms carefully before signing binding contracts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center border border-violet-400/40">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Contract<span className="text-violet-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Demystifying internship offers, hostel agreements, coaching terms, and student contracts into clear, student-friendly explanations with instant AI obligation detection.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/30 text-xs text-violet-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Built as a College Real-World Capstone Project</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-violet-300 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/analyzer" className="hover:text-violet-300 transition-colors">Contract Analyzer</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-violet-300 transition-colors">Analysis History</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-violet-300 transition-colors">About & Purpose</Link>
              </li>
            </ul>
          </div>

          {/* Target Agreements */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Supported Contracts</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Internship Offers & Stipends</li>
              <li>• Hostel & PG Accommodations</li>
              <li>• Coaching & Course Enrollments</li>
              <li>• Freelance & Gig Agreements</li>
              <li>• Software Subscriptions & Terms</li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} ContractAI. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-gray-400">
            <span>Privacy-First Architecture</span>
            <span>•</span>
            <span>No Unencrypted Storage</span>
            <span>•</span>
            <span>Zero Third-Party Ad Trackers</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
