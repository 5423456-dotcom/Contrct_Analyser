import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, X, ArrowRight, Sparkles, FileCode, HelpCircle } from 'lucide-react';
import { contractService } from '../services/api';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function UploadBox({ onStartAnalysis, onError }) {
  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' or 'text'
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [loadingSample, setLoadingSample] = useState(false);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      onError('Please upload a valid PDF file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError('File size exceeds the 10 MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadSample = async (type) => {
    try {
      setLoadingSample(true);
      const sample = await contractService.getSample(type);
      setActiveTab('text');
      setPastedText(sample.text);
      setTextTitle(sample.title);
    } catch (err) {
      onError('Failed to load sample agreement: ' + err.message);
    } finally {
      setLoadingSample(false);
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'pdf') {
      if (!selectedFile) {
        onError('Please select or drop a PDF file to analyze.');
        return;
      }
      onStartAnalysis({ mode: 'pdf', file: selectedFile });
    } else {
      if (!pastedText.trim() || pastedText.trim().length < 30) {
        onError('Please paste at least a paragraph of agreement text.');
        return;
      }
      onStartAnalysis({
        mode: 'text',
        text: pastedText,
        filename: textTitle.trim() ? `${textTitle.trim()}.txt` : 'Agreement_Text.txt',
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      
      {/* Tab Switcher */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex bg-[#0f0f18] p-1 rounded-xl border border-violet-500/20">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'pdf'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload PDF</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Paste Text</span>
          </button>
        </div>

        {/* Demo Quick Load Buttons */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-xs text-gray-400">Demo Mode:</span>
          <button
            onClick={() => handleLoadSample('internship')}
            disabled={loadingSample}
            className="px-2.5 py-1 text-xs rounded-lg bg-violet-950/40 hover:bg-violet-900/50 border border-violet-500/30 text-violet-300 transition-colors"
          >
            Load Internship
          </button>
          <button
            onClick={() => handleLoadSample('hostel')}
            disabled={loadingSample}
            className="px-2.5 py-1 text-xs rounded-lg bg-violet-950/40 hover:bg-violet-900/50 border border-violet-500/30 text-violet-300 transition-colors"
          >
            Load Hostel/PG
          </button>
        </div>
      </div>

      {/* Main Upload Box */}
      {activeTab === 'pdf' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all duration-300 text-center ${
            isDragging
              ? 'border-violet-400 bg-violet-950/30 scale-[1.01]'
              : selectedFile
              ? 'border-violet-500/40 bg-violet-950/15'
              : 'border-violet-900/40 hover:border-violet-600/60 bg-[#090910]/70'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-950/50 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-600/20 group">
                <Upload className="w-8 h-8 text-violet-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  Drag & drop your agreement PDF here
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="text-violet-400 hover:text-violet-300 underline font-medium"
                  >
                    browse from your computer
                  </button>
                </p>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                PDF only • Recommended maximum size: 10 MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-900/40 border border-violet-400/40 flex items-center justify-center shadow-lg shadow-violet-600/30">
                <FileText className="w-8 h-8 text-violet-300" />
              </div>
              <div>
                <p className="text-base font-semibold text-white truncate max-w-md mx-auto">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-violet-300 font-mono mt-0.5">
                  Size: {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove file</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Paste Text Box */
        <div className="space-y-3 bg-[#090910]/70 p-6 rounded-2xl border border-violet-900/40">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Agreement Title (Optional)
            </label>
            <input
              type="text"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
              placeholder="e.g., Software Internship Offer 2026"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0e0e17] border border-violet-500/20 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Paste Agreement Clauses / Text
            </label>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste contract sections, clauses, offer letter clauses, or PG agreement terms here..."
              className="w-full p-4 rounded-xl bg-[#0e0e17] border border-violet-500/20 text-gray-200 text-sm focus:outline-none focus:border-violet-500 font-mono leading-relaxed"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{pastedText.length} characters</span>
            <button
              onClick={() => {
                setPastedText('');
                setTextTitle('');
              }}
              className="text-gray-400 hover:text-gray-300"
            >
              Clear text
            </button>
          </div>
        </div>
      )}

      {/* Mobile Demo Loaders */}
      <div className="sm:hidden flex items-center justify-center space-x-2 mt-3">
        <span className="text-xs text-gray-400">Demo:</span>
        <button
          onClick={() => handleLoadSample('internship')}
          className="px-2 py-1 text-xs rounded bg-violet-950/40 border border-violet-500/30 text-violet-300"
        >
          Load Internship
        </button>
        <button
          onClick={() => handleLoadSample('hostel')}
          className="px-2 py-1 text-xs rounded bg-violet-950/40 border border-violet-500/30 text-violet-300"
        >
          Load Hostel/PG
        </button>
      </div>

      {/* Main Analyze CTA Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-violet-400/40 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base"
        >
          <Sparkles className="w-5 h-5 text-violet-200" />
          <span>Analyze My Agreement</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

    </div>
  );
}
