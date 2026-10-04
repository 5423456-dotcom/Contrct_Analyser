import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mx-auto shadow-xl shadow-violet-950/40">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-violet-400 font-mono">404</span>
          <h1 className="text-2xl font-bold text-white tracking-tight">Page Not Found</h1>
          <p className="text-sm text-gray-400">
            The contract clause or page you are searching for does not exist or has been relocated.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-lg shadow-violet-600/30 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
