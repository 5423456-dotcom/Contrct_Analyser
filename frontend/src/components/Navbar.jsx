import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  History,
  Info,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  Sparkles,
  User,
  LayoutDashboard,
  Users,
  WifiOff,
} from 'lucide-react';
import { authService } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const checkUser = () => {
    setUser(authService.getCurrentUser());
  };

  useEffect(() => {
    checkUser();
    const handleAuthChange = () => checkUser();
    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/login', { replace: true });
  };

  const navLinks = user
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Contract AI', path: '/analyzer', icon: Sparkles },
        { name: 'History', path: '/history', icon: History },
        { name: 'About', path: '/about', icon: Info },
      ]
    : [
        { name: 'Home', path: '/', icon: FileText },
        { name: 'About', path: '/about', icon: Info },
      ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#07070a]/90 backdrop-blur-md border-b border-violet-500/20 shadow-lg shadow-violet-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center border border-violet-400/40 shadow-md shadow-violet-600/30 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-violet-300 transition-colors">
                Contract<span className="text-violet-400">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider text-violet-300/70 font-medium">
                Student Contact & Agreement Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-white bg-violet-600/20 border border-violet-500/40 shadow-sm shadow-violet-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-violet-950/30'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-violet-400' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Auth Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 bg-violet-950/30 border border-violet-500/20 rounded-xl px-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-400/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-violet-300" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-gray-400 leading-tight truncate max-w-[140px]">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="ml-2 p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-violet-950/40 border border-transparent hover:border-violet-500/30 transition-all"
                >
                  <LogIn className="w-4 h-4 text-violet-400" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 border border-violet-400/40 shadow-md shadow-violet-600/30 hover:shadow-violet-600/50 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
            {/* Offline Demo Mode indicator */}
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-400" title="App runs 100% offline — no internet required">
              <WifiOff className="w-3 h-3" />
              <span className="hidden lg:inline">Offline Demo</span>
            </div>
          </div>


          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-violet-950/40 border border-violet-500/20"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-violet-400" /> : <Menu className="w-6 h-6 text-violet-400" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a10] border-b border-violet-500/20 px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'text-white bg-violet-600/20 border border-violet-500/40'
                    : 'text-gray-300 hover:bg-violet-950/30'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-violet-400' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-violet-900/30 space-y-2">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-violet-950/40 rounded-lg border border-violet-500/20">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 bg-violet-950/30 border border-violet-500/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 border border-violet-400/40"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
