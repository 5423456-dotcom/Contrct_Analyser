import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History as HistoryIcon,
  FileText,
  Calendar,
  Download,
  Trash2,
  ExternalLink,
  Search,
  AlertCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { analysisService } from '../services/api';

export default function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const items = await analysisService.getHistory();
      setHistoryItems(items);
    } catch (err) {
      setError(err.message || 'Failed to load analysis history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this agreement analysis from your history?')) {
      return;
    }

    try {
      setDeletingId(id);
      await analysisService.deleteAnalysis(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Failed to delete analysis: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadReport = async (id, filename, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await analysisService.downloadPdfReport(id, filename);
    } catch (err) {
      alert('Failed to download report: ' + err.message);
    }
  };

  const filteredItems = historyItems.filter((item) =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.summary_preview && item.summary_preview.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-violet-900/30">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-violet-400">
            <HistoryIcon className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider font-semibold">MongoDB Archive</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Review your previously evaluated contracts, compare conditions, and download PDF summaries.
          </p>
        </div>

        <Link
          to="/analyzer"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/30 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze New Contract</span>
        </Link>
      </div>

      {/* Search Bar */}
      {historyItems.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by agreement name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#090910] border border-violet-500/20 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {filteredItems.length} of {historyItems.length} stored
          </span>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Retrieving analysis history from database...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/30 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={loadHistory}
            className="text-xs text-violet-400 underline hover:text-violet-300"
          >
            Retry Loading
          </button>
        </div>
      ) : historyItems.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center space-y-5 bg-[#090910]/50 rounded-3xl border border-violet-900/20 p-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-center text-violet-400 mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">No agreements analyzed yet.</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Your analyzed internship, hostel, or employment contracts will appear here for easy comparison.
            </p>
          </div>
          <div>
            <Link
              to="/analyzer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Your First Agreement</span>
            </Link>
          </div>
        </div>
      ) : (
        /* History Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item) => {
            const dateStr = new Date(item.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#0a0a12] border border-violet-500/20 glass-panel glass-panel-hover flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      {item.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center space-x-1 font-mono">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <span>{dateStr}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white truncate group-hover:text-violet-300 transition-colors">
                    {item.filename}
                  </h3>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.summary_preview}
                  </p>
                </div>

                <div className="pt-3 border-t border-violet-900/30 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1 text-violet-300 font-medium">
                      <Layers className="w-3.5 h-3.5 text-violet-400" />
                      <span>{item.findings_count} findings</span>
                    </span>
                    <span>•</span>
                    <span>{item.page_count} {item.page_count === 1 ? 'page' : 'pages'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleDownloadReport(item.id, item.filename, e)}
                      title="Download PDF Report"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-violet-950/50 transition-colors"
                    >
                      <Download className="w-4 h-4 text-violet-400" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      disabled={deletingId === item.id}
                      title="Delete Analysis"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/results/${item.id}`}
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600 text-violet-200 hover:text-white border border-violet-500/30 text-xs font-semibold transition-all"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
