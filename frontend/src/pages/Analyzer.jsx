import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, AlertCircle, FileText, CheckCircle2, Info } from 'lucide-react';
import UploadBox from '../components/UploadBox';
import Loading from '../components/Loading';
import { contractService, analysisService } from '../services/api';

export default function Analyzer() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilename, setCurrentFilename] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleStartAnalysis = async ({ mode, file, text, filename }) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      let contractResponse;
      if (mode === 'pdf') {
        setCurrentFilename(file.name);
        contractResponse = await contractService.uploadPdf(file);
      } else {
        const docName = filename || 'Pasted_Agreement.txt';
        setCurrentFilename(docName);
        contractResponse = await contractService.uploadText(text, docName);
      }

      // Now trigger AI analysis
      const analysisResult = await analysisService.triggerAnalysis(contractResponse.id);
      
      // Navigate to results page
      navigate(`/results/${analysisResult.id}`);
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'We could not analyze this agreement right now. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs text-violet-300 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Automated Contract Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Analyze Your Agreement
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
          Upload an internship, employment, PG/hostel, or course contract to reveal hidden obligations and risks.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="max-w-3xl mx-auto p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Analysis Failed</p>
            <p className="text-xs text-red-300/90 mt-0.5">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="text-red-400 hover:text-red-200 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Analyzer Component */}
      {isLoading ? (
        <Loading filename={currentFilename} />
      ) : (
        <div className="space-y-8">
          <UploadBox
            onStartAnalysis={handleStartAnalysis}
            onError={(msg) => setErrorMessage(msg)}
          />

          {/* Quick Guidance Box */}
          <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-[#090910] border border-violet-900/30 flex items-start space-x-3 text-xs text-gray-400">
            <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-gray-300">How ContractAI parses your document:</span>
              <p>
                PyMuPDF extracts raw text and tracks page indexes. The AI engine then classifies clauses into 21 student-critical categories (lock-in terms, notice periods, payments, non-compete covenants, and penalties) and outputs actionable advice.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
