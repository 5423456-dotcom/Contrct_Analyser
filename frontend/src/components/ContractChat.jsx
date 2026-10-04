import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Quote,
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { analysisService } from '../services/api';

export default function ContractChat({ analysisId, filename = 'Agreement', summary = '', findings = [] }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your **ContractAI Assistant**. I've indexed **${filename}**.\n\nYou can ask me anything about your obligations, lock-in periods, notice terms, stipends, or penalties. Click any prompt below or type your question!`,
      citations: [],
      suggested_followups: [
        'Can I resign early or quit before completion?',
        'What is the notice period required to leave?',
        'What are the financial penalties or deposits?',
        'Who owns any code or projects I create?'
      ],
      engine_used: 'ready'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatBottomRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (questionText = null) => {
    const textToSend = (typeof questionText === 'string' ? questionText : inputValue).trim();
    if (!textToSend || loading) return;

    setError('');
    const newHistory = [
      ...messages,
      { role: 'user', content: textToSend }
    ];
    setMessages(newHistory);
    setInputValue('');
    setLoading(true);

    try {
      // Build lightweight conversation history for the API
      const apiHistory = newHistory
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await analysisService.askContractQuestion(analysisId, textToSend, apiHistory);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.reply || 'Here is the information from your agreement.',
          citations: res.citations || [],
          suggested_followups: res.suggested_followups || [],
          engine_used: res.engine_used || 'offline_heuristics'
        }
      ]);
    } catch (err) {
      setError(err.message || 'Failed to get answer from AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat history reset. How can I help you understand **${filename}**?`,
        citations: [],
        suggested_followups: [
          'Can I resign early or quit before completion?',
          'What is the notice period required to leave?',
          'What are the financial penalties or deposits?',
          'Who owns any code or projects I create?'
        ],
        engine_used: 'ready'
      }
    ]);
    setError('');
  };

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
  const activeSuggested = lastAssistantMsg?.suggested_followups || [];

  return (
    <div className="bg-[#0b0b13]/85 rounded-2xl border border-violet-500/25 p-5 sm:p-7 glass-panel violet-glow relative overflow-hidden shadow-2xl">
      {/* Soft Ambient Background Glow */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-violet-900/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shadow-md shadow-violet-900/30">
            <Bot className="w-5 h-5 text-violet-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Ask ContractAI Assistant
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Interactive</span>
              </span>
            </div>
            <p className="text-xs text-violet-300/80">
              Instant answers grounded verbatim in {filename}
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          title="Reset chat conversation"
          className="text-xs text-gray-400 hover:text-white flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="my-4 space-y-4 max-h-[460px] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-violet-900 scrollbar-track-transparent">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/40'
                    : 'bg-[#141426] border border-violet-500/30 text-violet-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Container */}
              <div className={`space-y-2.5 max-w-[88%] sm:max-w-[80%]`}>
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-violet-900/30'
                      : 'bg-[#0f0f1b] border border-violet-500/20 text-gray-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Citations Box (if returned by AI) */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/25 space-y-2">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-violet-300 uppercase tracking-wider">
                      <Quote className="w-3 h-3 text-violet-400" />
                      <span>Referenced Contract Clauses</span>
                    </div>
                    <div className="space-y-1.5">
                      {msg.citations.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-2 rounded-lg bg-[#0a0a14] border border-violet-500/15 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-gray-400">
                            <span className="font-semibold text-violet-300">{c.category}</span>
                            <span className="px-1.5 py-0.5 rounded bg-violet-900/40 text-violet-300 border border-violet-500/30">
                              Page {c.page_number}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-300 italic font-mono leading-tight">
                            "{c.clause_text}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shrink-0 bg-[#141426] border border-violet-500/30 text-violet-300 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-[#0f0f1b] border border-violet-500/20 text-xs text-violet-300 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span>Analyzing contract clauses for your answer...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Follow-up Question Chips */}
      {activeSuggested.length > 0 && !loading && (
        <div className="pt-2 pb-3">
          <div className="flex items-center space-x-1.5 text-[11px] font-medium text-violet-300/80 mb-2">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>Suggested Student Questions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeSuggested.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-left text-xs px-3 py-1.5 rounded-xl bg-violet-950/40 hover:bg-violet-900/60 border border-violet-500/30 hover:border-violet-400 text-violet-200 transition-all flex items-center space-x-1.5 group"
              >
                <span>{q}</span>
                <ChevronRight className="w-3 h-3 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="mb-3 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Bar */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about notice, penalties, stipend, exit rules..."
          disabled={loading}
          className="w-full pl-4 pr-24 py-3 rounded-xl bg-[#080811] border border-violet-500/30 focus:border-violet-500 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all disabled:opacity-50"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputValue.trim()}
          className="absolute right-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs flex items-center space-x-1.5 transition-all disabled:opacity-40 disabled:hover:bg-violet-600 shadow-md shadow-violet-600/30"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-2 text-center text-[10px] text-gray-500">
        ContractAI is an automated student reading assistant and does not constitute formal legal counsel.
      </div>
    </div>
  );
}
