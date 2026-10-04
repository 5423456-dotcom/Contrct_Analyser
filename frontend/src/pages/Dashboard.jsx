import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Sparkles,
  AlertTriangle,
  FileText,
  BarChart3,
  Search,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Tag,
  RefreshCw,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Filter,
  UserCheck,
  Building,
  GraduationCap,
  Briefcase,
  Home as HomeIcon,
  ChevronRight,
  HelpCircle,
  X,
  Database,
} from 'lucide-react';
import { contactService } from '../services/contactService';
import { authService } from '../services/api';
import { offlineDemoService } from '../services/demoDataService';

const CATEGORIES = [
  'All',
  'Teachers',
  'College',
  'Friends',
  'Internship',
  'Placement',
  'Hackathon',
  'Professional',
  'Professor / Faculty',
  'Recruiter / HR',
  'Internship Mentor',
  'Peer / Student',
  'Landlord / PG Warden',
  'Alumni',
];


export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive, high-priority

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [csvError, setCsvError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Peer / Student',
    tags: '',
    lastInteraction: new Date().toISOString().split('T')[0],
    interactionFrequency: 'Weekly',
    priority: 'Medium',
    notes: '',
  });

  useEffect(() => {
    setUser(authService.getCurrentUser());
    loadContacts();
  }, []);

  const loadContacts = () => {
    const list = contactService.getContacts();
    setContacts(list);
  };

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // Run Rule-Based AI Engine over the actual contacts
  const analytics = useMemo(() => {
    return contactService.analyzeContacts(contacts);
  }, [contacts]);

  // Filtered contacts list
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      // Search term
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.phone && c.phone.includes(searchTerm)) ||
        (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.tags && c.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

      // Category
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;

      // Status
      let matchesStatus = true;
      const daysAgo = c.lastInteraction
        ? Math.floor((new Date() - new Date(c.lastInteraction)) / (1000 * 60 * 60 * 24))
        : 999;
      const isActive = daysAgo <= 30 && c.interactionFrequency !== 'Rarely';

      if (statusFilter === 'active') matchesStatus = isActive;
      if (statusFilter === 'inactive') matchesStatus = !isActive;
      if (statusFilter === 'high-priority') matchesStatus = c.priority === 'High';

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [contacts, searchTerm, selectedCategory, statusFilter]);

  // Handle Form Submit (Add or Edit)
  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingContact) {
      contactService.updateContact(editingContact.id, formData);
      setActionSuccess(`Updated ${formData.name}`);
    } else {
      contactService.addContact(formData);
      setActionSuccess(`Added new contact ${formData.name}`);
    }

    loadContacts();
    setShowAddModal(false);
    setEditingContact(null);
    resetForm();
    setTimeout(() => setActionSuccess(''), 3500);
  };

  const handleEditClick = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      category: contact.category || 'Peer / Student',
      tags: Array.isArray(contact.tags) ? contact.tags.join(', ') : contact.tags || '',
      lastInteraction: contact.lastInteraction || new Date().toISOString().split('T')[0],
      interactionFrequency: contact.interactionFrequency || 'Weekly',
      priority: contact.priority || 'Medium',
      notes: contact.notes || '',
    });
    setShowAddModal(true);
  };

  const handleDeleteClick = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      contactService.deleteContact(id);
      loadContacts();
      setActionSuccess(`Deleted contact`);
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: 'Peer / Student',
      tags: '',
      lastInteraction: new Date().toISOString().split('T')[0],
      interactionFrequency: 'Weekly',
      priority: 'Medium',
      notes: '',
    });
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset contacts list to the default demo student dataset?')) {
      const demoList = contactService.resetToDemo();
      setContacts(demoList);
      setActionSuccess('Demo student contacts loaded successfully!');
      setTimeout(() => setActionSuccess(''), 3500);
    }
  };

  const handleLoadDemoData = () => {
    if (window.confirm('Load 20 realistic student demo contacts across Teachers, College, Friends, Internship, Placement, Hackathon, and Professional categories?\n\nThis will also seed 2 sample contract analyses in your History.\n\nExisting contacts will be replaced.')) {
      const demoContacts = offlineDemoService.loadDemoContacts();
      offlineDemoService.loadDemoAnalyses();
      setContacts(demoContacts);
      setActionSuccess(`✓ Loaded ${demoContacts.length} demo student contacts across 7 categories + 2 sample contract analyses — all stored locally, no internet required!`);
      setTimeout(() => setActionSuccess(''), 6000);
    }
  };


  const handleExportCsv = () => {
    const csvData = contactService.exportCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Student_Contacts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvImport = () => {
    setCsvError('');
    if (!csvContent.trim()) {
      setCsvError('Please paste CSV contents or upload a .csv file.');
      return;
    }
    try {
      const res = contactService.importCsv(csvContent);
      loadContacts();
      setShowCsvModal(false);
      setCsvContent('');
      setActionSuccess(`Successfully imported ${res.addedCount} contacts!`);
      setTimeout(() => setActionSuccess(''), 3500);
    } catch (err) {
      setCsvError(err.message || 'Failed to parse CSV format.');
    }
  };

  const handleCsvFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvContent(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#0b0b14] to-indigo-950/30 border border-violet-500/25 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">
              Student Workspace & Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-violet-400">{user?.name || 'Student'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Monitor critical contacts, internship correspondence, and agreement obligations in one place.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setEditingContact(null);
              resetForm();
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 border border-violet-400/40 shadow-lg shadow-violet-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>

          <button
            onClick={() => setShowCsvModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-200 bg-[#0c0c16] hover:bg-violet-950/40 border border-violet-500/20 hover:border-violet-500/40 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-violet-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-200 bg-[#0c0c16] hover:bg-violet-950/40 border border-violet-500/20 hover:border-violet-500/40 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-violet-400" />
            <span>Export CSV</span>
          </button>


          <button
            onClick={handleLoadDemoData}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/40 shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            title="Load 20 realistic offline demo contacts across 7 student categories"
          >
            <Database className="w-4 h-4" />
            <span>Load Demo Data</span>
          </button>

          <button
            onClick={handleResetDemo}
            title="Reload Default Demo Contacts"
            className="p-2 rounded-xl text-gray-400 hover:text-violet-300 bg-[#0c0c16] hover:bg-violet-950/40 border border-violet-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm flex items-center space-x-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-violet-900/30 scrollbar-none">
        {[
          { id: 'overview', name: 'Student Dashboard', icon: BarChart3 },
          { id: 'contacts', name: 'Contact Analyzer', icon: Users, badge: contacts.length },
          { id: 'ai-analysis', name: 'AI-Powered Analysis', icon: Sparkles },
          { id: 'insights', name: 'Smart Insights', icon: TrendingUp },
          { id: 'risks', name: 'Risk / Pattern Detection', icon: ShieldAlert, badge: analytics.inactiveHighPriority.length + analytics.duplicates.length },
          { id: 'reports', name: 'Reports & Analytics', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-violet-950/30'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-violet-400'}`} />
              <span>{tab.name}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    active ? 'bg-violet-800 text-violet-100' : 'bg-violet-950/70 text-violet-300 border border-violet-500/20'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: OVERVIEW / STUDENT DASHBOARD                            */}
      {/* ============================================================== */}
      {currentTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Metric Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#0b0b14]/80 p-5 rounded-2xl border border-violet-500/20 glass-panel space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Total Contacts</span>
                <Users className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {analytics.totalContacts}
              </p>
              <p className="text-[11px] text-gray-400">Recorded across academic & professional network</p>
            </div>

            <div className="bg-[#0b0b14]/80 p-5 rounded-2xl border border-violet-500/20 glass-panel space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Active Contacts</span>
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {analytics.activeCount}
              </p>
              <p className="text-[11px] text-gray-400">Interacted within last 30 days</p>
            </div>

            <div className="bg-[#0b0b14]/80 p-5 rounded-2xl border border-violet-500/20 glass-panel space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Follow-Up Needed</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                {analytics.inactiveCount}
              </p>
              <p className="text-[11px] text-gray-400">No interaction for 30+ days</p>
            </div>

            <div className="bg-[#0b0b14]/80 p-5 rounded-2xl border border-violet-500/20 glass-panel space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Network Health</span>
                <TrendingUp className="w-4 h-4 text-violet-400" />
              </div>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-violet-300 font-mono">
                  {analytics.healthScore}%
                </p>
                <span className="text-xs text-emerald-400 font-medium">Optimal</span>
              </div>
              <div className="w-full bg-violet-950/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 to-indigo-400 h-1.5 rounded-full"
                  style={{ width: `${analytics.healthScore}%` }}
                />
              </div>
            </div>

          </div>

          {/* Quick Actions & AI Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Top AI Action Alerts */}
            <div className="lg:col-span-2 bg-[#090910] p-6 rounded-2xl border border-violet-900/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <h3 className="text-base font-bold text-white">AI Priority Action Recommendations</h3>
                </div>
                <button
                  onClick={() => setTab('ai-analysis')}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {analytics.aiRecommendations.slice(0, 3).map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0e0e18] border border-violet-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-violet-500/30 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {rec.type === 'critical' ? (
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        ) : rec.type === 'warning' ? (
                          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                        )}
                        <h4 className="text-xs sm:text-sm font-semibold text-white">{rec.title}</h4>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed pl-6">{rec.description}</p>
                    </div>
                    <button
                      onClick={() => setTab(rec.type === 'warning' ? 'risks' : 'contacts')}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-violet-950/60 hover:bg-violet-900/60 border border-violet-500/30 text-xs font-medium text-violet-300 hover:text-white transition-all text-center cursor-pointer"
                    >
                      {rec.actionText}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Student Workflows */}
            <div className="bg-[#090910] p-6 rounded-2xl border border-violet-900/30 space-y-4">
              <h3 className="text-base font-bold text-white">Student Workflows</h3>
              
              <div className="space-y-3">
                <Link
                  to="/analyzer"
                  className="p-3.5 rounded-xl bg-violet-950/30 hover:bg-violet-950/60 border border-violet-500/20 hover:border-violet-500/40 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-violet-300">Contract Analyzer</p>
                      <p className="text-[11px] text-gray-400">Scan internship & hostel lease agreements</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400" />
                </Link>

                <button
                  onClick={() => setTab('contacts')}
                  className="w-full p-3.5 rounded-xl bg-violet-950/30 hover:bg-violet-950/60 border border-violet-500/20 hover:border-violet-500/40 flex items-center justify-between transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-violet-300">Contact Directory</p>
                      <p className="text-[11px] text-gray-400">Search and filter faculty & recruiters</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400" />
                </button>

                <button
                  onClick={() => setTab('risks')}
                  className="w-full p-3.5 rounded-xl bg-violet-950/30 hover:bg-violet-950/60 border border-violet-500/20 hover:border-violet-500/40 flex items-center justify-between transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-violet-300">Risk & Duplicates</p>
                      <p className="text-[11px] text-gray-400">Spot cold leads and duplicate rows</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400" />
                </button>
              </div>

            </div>

          </div>

          {/* Recent Contacts Snapshot */}
          <div className="bg-[#0b0b14]/70 p-6 rounded-2xl border border-violet-500/20 glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Recent Contacts & Interactions</h3>
              <button
                onClick={() => setTab('contacts')}
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center space-x-1"
              >
                <span>Full Directory ({contacts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.slice(0, 6).map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-[#090912] border border-violet-500/15 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-white">{c.name}</h4>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          c.priority === 'High'
                            ? 'bg-red-950/60 text-red-300 border border-red-500/30'
                            : 'bg-violet-950/60 text-violet-300 border border-violet-500/20'
                        }`}
                      >
                        {c.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">{c.category}</p>
                    {c.email && (
                      <p className="text-[11px] text-gray-500 flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Last: {c.lastInteraction}</span>
                    <span className="font-mono text-violet-400">{c.interactionFrequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CONTACT ANALYZER & DIRECTORY                            */}
      {/* ============================================================== */}
      {currentTab === 'contacts' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#0b0b14]/80 border border-violet-500/20 glass-panel flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, tag..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-xs sm:text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <div className="flex rounded-xl bg-[#08080f] border border-violet-500/20 p-0.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'active', label: 'Active' },
                  { id: 'inactive', label: 'Inactive' },
                  { id: 'high-priority', label: 'High Priority' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      statusFilter === st.id ? 'bg-violet-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contacts Grid / Table */}
          {filteredContacts.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-2xl bg-[#090910] border border-violet-900/30 space-y-3">
              <Users className="w-10 h-10 text-gray-500 mx-auto opacity-50" />
              <h3 className="text-base font-semibold text-white">No Contacts Match Your Query</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Try adjusting your search terms or filters, or add a new contact record.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-xs font-medium text-violet-200 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map((c) => {
                const daysAgo = c.lastInteraction
                  ? Math.floor((new Date() - new Date(c.lastInteraction)) / (1000 * 60 * 60 * 24))
                  : 999;
                const isActive = daysAgo <= 30 && c.interactionFrequency !== 'Rarely';

                return (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-[#0b0b14]/90 border border-violet-500/20 glass-panel flex flex-col justify-between space-y-4 hover:border-violet-500/40 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white">{c.name}</h4>
                          <span className="text-[11px] text-violet-300 font-medium">{c.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditClick(c)}
                            title="Edit Contact"
                            className="p-1.5 text-gray-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(c.id, c.name)}
                            title="Delete Contact"
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 text-xs text-gray-300 pt-1">
                        {c.email ? (
                          <a
                            href={`mailto:${c.email}`}
                            className="flex items-center space-x-2 text-gray-300 hover:text-violet-300 truncate"
                          >
                            <Mail className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                            <span className="truncate">{c.email}</span>
                          </a>
                        ) : (
                          <div className="flex items-center space-x-2 text-amber-400/80 text-[11px]">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span>No email recorded</span>
                          </div>
                        )}

                        {c.phone ? (
                          <a
                            href={`tel:${c.phone}`}
                            className="flex items-center space-x-2 text-gray-300 hover:text-violet-300"
                          >
                            <Phone className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                            <span>{c.phone}</span>
                          </a>
                        ) : (
                          <div className="flex items-center space-x-2 text-amber-400/80 text-[11px]">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span>No phone recorded</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {c.tags && c.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {c.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-violet-950/60 text-violet-300 border border-violet-500/20 font-mono"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {c.notes && (
                        <p className="text-xs text-gray-400 bg-[#07070d] p-2.5 rounded-xl border border-white/5 line-clamp-2 italic">
                          "{c.notes}"
                        </p>
                      )}
                    </div>

                    {/* Footer Meta */}
                    <div className="pt-3 border-t border-violet-900/30 flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span className="text-gray-400">
                          {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                        </span>
                      </div>
                      <span className="text-gray-400 font-mono">
                        Freq: <strong className="text-white">{c.interactionFrequency}</strong>
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: AI-POWERED ANALYSIS                                     */}
      {/* ============================================================== */}
      {currentTab === 'ai-analysis' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-6 rounded-2xl bg-[#090912] border border-violet-500/20 space-y-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h2 className="text-xl font-bold text-white">AI-Powered Contact & Network Analysis</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">
              Evaluates interaction frequency, detects cold connections, and provides tailored outreach suggestions based on your real contact data.
            </p>
          </div>

          {/* AI Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-[#0b0b14]/80 p-6 rounded-2xl border border-violet-500/20 glass-panel space-y-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Communication Patterns
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Daily / Active Check-ins:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {analytics.frequencyBreakdown['Daily'] || 0} Contacts
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Weekly Cadence:</span>
                  <span className="font-mono font-bold text-violet-300">
                    {analytics.frequencyBreakdown['Weekly'] || 0} Contacts
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Monthly Check-ins:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {analytics.frequencyBreakdown['Monthly'] || 0} Contacts
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Rare / At-Risk of Ghosting:</span>
                  <span className="font-mono font-bold text-red-400">
                    {analytics.frequencyBreakdown['Rarely'] || 0} Contacts
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0b14]/80 p-6 rounded-2xl border border-violet-500/20 glass-panel space-y-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Important High-Priority Contacts
                </h3>
              </div>
              {analytics.inactiveHighPriority.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All high-priority contacts have active recent touchpoints!</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {analytics.inactiveHighPriority.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#080810] border border-amber-500/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{item.contact.name}</p>
                        <p className="text-[11px] text-gray-400">{item.contact.category}</p>
                      </div>
                      <span className="text-[11px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30">
                        {item.daysAgo} days idle
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* AI Generated Recommendations */}
          <div className="bg-[#0b0b14]/80 p-6 rounded-2xl border border-violet-500/20 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Smart Actionable Advice
            </h3>
            <div className="space-y-3">
              {analytics.aiRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#080811] border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">{rec.title}</h4>
                    <p className="text-xs text-gray-400">{rec.description}</p>
                  </div>
                  <button
                    onClick={() => setTab('contacts')}
                    className="shrink-0 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white cursor-pointer"
                  >
                    {rec.actionText}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SMART INSIGHTS                                          */}
      {/* ============================================================== */}
      {currentTab === 'insights' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category Distribution */}
            <div className="bg-[#0b0b14]/80 p-6 rounded-2xl border border-violet-500/20 glass-panel space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Network Category Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.categoryBreakdown).map(([cat, count]) => {
                  const percent = Math.round((count / (analytics.totalContacts || 1)) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">{cat}</span>
                        <span className="font-mono text-violet-400">
                          {count} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#121220] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-violet-500 h-2 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interaction Ratios */}
            <div className="bg-[#0b0b14]/80 p-6 rounded-2xl border border-violet-500/20 glass-panel space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Engagement Status Overview
              </h3>
              
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-[#080811] border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Active Contacts (Under 30 Days)</span>
                    <span className="font-bold text-emerald-400">
                      {Math.round((analytics.activeCount / (analytics.totalContacts || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{
                        width: `${Math.round((analytics.activeCount / (analytics.totalContacts || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#080811] border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">High-Priority Coverage</span>
                    <span className="font-bold text-violet-400">
                      {analytics.highPriorityCount} / {analytics.totalContacts} Contacts
                    </span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-violet-500 h-2 rounded-full"
                      style={{
                        width: `${Math.round((analytics.highPriorityCount / (analytics.totalContacts || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#080811] border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Missing Contact Information</span>
                    <span className="font-bold text-amber-400">
                      {analytics.missingInfoCount} Incomplete Entries
                    </span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((analytics.missingInfoCount / (analytics.totalContacts || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: RISK / PATTERN DETECTION                                */}
      {/* ============================================================== */}
      {currentTab === 'risks' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-6 rounded-2xl bg-[#090912] border border-violet-500/20 space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-bold text-white">Risk & Duplicate Pattern Detection</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">
              Identifies stale high-value relationships, fragmented communications, and duplicate contact entries.
            </p>
          </div>

          {/* Duplicates Section */}
          <div className="bg-[#0b0b14]/80 p-6 rounded-2xl border border-violet-500/20 glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Duplicate Contact Entries ({analytics.duplicates.length})
                </h3>
              </div>
            </div>

            {analytics.duplicates.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No duplicate contact records found. Your address book is clean!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.duplicates.map((dup, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#090912] border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-amber-300">{dup.reason}:</span>
                        <span className="text-xs font-mono text-white bg-black/40 px-2 py-0.5 rounded">
                          {dup.value}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Record A: <strong className="text-white">{dup.contact1.name}</strong> ({dup.contact1.category}) vs. Record B: <strong className="text-white">{dup.contact2.name}</strong> ({dup.contact2.category})
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleDeleteClick(dup.contact2.id, dup.contact2.name)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-xs font-medium text-red-200 cursor-pointer"
                      >
                        Remove Record B
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Idle / Ghosted High Priority Contacts */}
          <div className="bg-[#0b0b14]/80 p-6 rounded-2xl border border-violet-500/20 glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Cold Communication Relationships
            </h3>
            {analytics.inactiveHighPriority.length === 0 ? (
              <p className="text-xs text-gray-400">No high-priority contacts are currently idle.</p>
            ) : (
              <div className="space-y-3">
                {analytics.inactiveHighPriority.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#090912] border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.contact.name}</h4>
                      <p className="text-xs text-gray-400">
                        Role: {item.contact.category} • Last contact date: {item.contact.lastInteraction} ({item.daysAgo} days ago)
                      </p>
                      {item.contact.notes && (
                        <p className="text-[11px] text-gray-500 italic mt-1">"{item.contact.notes}"</p>
                      )}
                    </div>
                    {item.contact.email && (
                      <a
                        href={`mailto:${item.contact.email}?subject=Quick%20Check-in`}
                        className="shrink-0 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send Follow-up</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: REPORTS & ANALYTICS                                     */}
      {/* ============================================================== */}
      {currentTab === 'reports' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-6 rounded-2xl bg-[#090912] border border-violet-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Student Contact Intelligence Report</h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  Comprehensive executive summary of your academic, recruiter, and mentor relationships.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center space-x-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV Sheet</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#0c0c18] hover:bg-violet-950/40 border border-violet-500/30 text-xs font-medium text-gray-200 cursor-pointer"
                >
                  Print Report
                </button>
              </div>
            </div>

            {/* Summary Table */}
            <div className="overflow-x-auto pt-4">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#05050a] text-gray-400 uppercase tracking-wider font-mono text-[10px] border-b border-violet-900/40">
                  <tr>
                    <th className="py-3 px-4">Contact Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Last Date</th>
                    <th className="py-3 px-4">Frequency</th>
                    <th className="py-3 px-4">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-violet-950/20">
                      <td className="py-3 px-4 font-semibold text-white">{c.name}</td>
                      <td className="py-3 px-4">{c.category}</td>
                      <td className="py-3 px-4 text-gray-400">{c.email || '—'}</td>
                      <td className="py-3 px-4 text-gray-400">{c.phone || '—'}</td>
                      <td className="py-3 px-4 font-mono">{c.lastInteraction}</td>
                      <td className="py-3 px-4">{c.interactionFrequency}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            c.priority === 'High'
                              ? 'bg-red-950/60 text-red-300 border border-red-500/20'
                              : 'bg-violet-950/60 text-violet-300'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT CONTACT                                      */}
      {/* ============================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0b0b14] border border-violet-500/30 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-violet-900/30 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingContact ? 'Edit Contact' : 'Add New Student Contact'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingContact(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Robert Chen or Priya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Last Interaction Date
                  </label>
                  <input
                    type="date"
                    value={formData.lastInteraction}
                    onChange={(e) => setFormData({ ...formData, lastInteraction: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Interaction Frequency
                  </label>
                  <select
                    value={formData.interactionFrequency}
                    onChange={(e) => setFormData({ ...formData, interactionFrequency: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Rarely">Rarely</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Internship, Project Guide, Hostel Lease"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Notes & Agreements
                </label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Important details, stipend clause discussion, recommendation letter deadline..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08080f] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-violet-900/30">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingContact(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-600/30 cursor-pointer"
                >
                  {editingContact ? 'Save Changes' : 'Create Contact'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: IMPORT CSV                                              */}
      {/* ============================================================== */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0b0b14] border border-violet-500/30 rounded-2xl shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-violet-900/30 pb-3">
              <h3 className="text-lg font-bold text-white">Import Contacts from CSV</h3>
              <button onClick={() => setShowCsvModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {csvError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{csvError}</span>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs text-gray-400">
                Upload a <code>.csv</code> file or paste CSV text containing columns like <strong>Name, Email, Phone, Category</strong>.
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Choose CSV File
                </label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvFileUpload}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Or Paste CSV Data Below
                </label>
                <textarea
                  rows="5"
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder={`Name,Email,Phone,Category,Last Interaction\nPriya Sharma,priya@company.com,+91 98450 54321,Recruiter / HR,2026-09-15`}
                  className="w-full px-3 py-2 rounded-xl bg-[#08080f] border border-violet-500/20 text-white font-mono text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-violet-900/30">
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCsvImport}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-600/30 cursor-pointer"
              >
                Import Contacts
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
