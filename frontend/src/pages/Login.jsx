import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

  // Detect if redirected from protected route
  const redirectedFrom = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await authService.login(email.trim(), password);
      // Redirect to attempted route or main dashboard
      const targetRoute = redirectedFrom || '/dashboard';
      navigate(targetRoute, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setEmail('student@university.edu');
    setPassword('student123');
    setError('');
    setLoading(true);

    try {
      await authService.login('student@university.edu', 'student123');
      const targetRoute = redirectedFrom || '/dashboard';
      navigate(targetRoute, { replace: true });
    } catch (err) {
      setError(err.message || 'Demo login failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[78vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center border border-violet-400/40 shadow-lg shadow-violet-600/30 mx-auto">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sign In to Contract<span className="text-violet-400">AI</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Student Authentication Gate & Intelligent Dashboard
          </p>
        </div>

        {/* Protected Route Banner */}
        {redirectedFrom && (
          <div className="p-3.5 rounded-xl bg-violet-950/50 border border-violet-500/40 text-violet-200 text-xs flex items-center space-x-2 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
            <span>
              Authentication required. Please sign in to access your dashboard and analysis tools.
            </span>
          </div>
        )}

        {/* Card */}
        <div className="bg-[#0b0b14]/80 p-6 sm:p-8 rounded-2xl border border-violet-500/25 glass-panel shadow-2xl space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && !error && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-violet-600 hover:bg-violet-500 border border-violet-400/40 shadow-lg shadow-violet-600/30 flex items-center justify-center space-x-2 transition-all mt-2 disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
            </button>
          </form>

          {/* Quick Demo Fill & Instant Sign In */}
          <div className="pt-3 border-t border-violet-900/30 space-y-2">
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="w-full py-2.5 px-3 rounded-xl bg-violet-950/40 hover:bg-violet-900/50 border border-violet-500/30 text-xs text-violet-300 hover:text-white flex items-center justify-center space-x-2 transition-all cursor-pointer font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>One-Click Demo Student Sign In</span>
            </button>
            <p className="text-[11px] text-gray-500 text-center font-mono">
              Pre-loaded with sample student contacts & contract history
            </p>
          </div>

          {/* Footer Link */}
          <div className="text-center text-xs text-gray-400 pt-1">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold underline">
              Create an account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
