import axios from 'axios';
import { offlineDemoService, OFFLINE_SAMPLE_TEXTS } from './demoDataService';


const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('contractai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Clean and user-friendly error response handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response?.data?.detail) {
      message = error.response.data.detail;
    } else if (error.message) {
      if (error.message.includes('Network Error')) {
        message = 'Unable to connect to the server. Please check your internet connection or ensure the backend server is running.';
      } else {
        message = error.message;
      }
    }
    return Promise.reject(new Error(message));
  }
);

// Local user persistence for hackathon & standalone demo resilience
const USERS_DB_KEY = 'contractai_registered_users_db';

const getLocalUsers = () => {
  const data = localStorage.getItem(USERS_DB_KEY);
  if (!data) {
    const defaultUser = [
      {
        id: 'usr_demo_student',
        name: 'Alex Sharma',
        email: 'student@university.edu',
        password: 'student123',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveLocalUsers = (users) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

export const authService = {
  getLocalUsers,

  async register(name, email, password) {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedName = (name || '').trim();

    if (!trimmedName) {
      throw new Error('Please enter your full name.');
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Check duplicate email in local database
    const localUsers = getLocalUsers();
    if (localUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    // Try backend API if available
    try {
      const res = await api.post('/auth/register', { name: trimmedName, email: trimmedEmail, password });
      if (res.data.access_token) {
        localStorage.setItem('contractai_token', res.data.access_token);
        localStorage.setItem('contractai_user', JSON.stringify(res.data.user));
        // Also mirror in local DB
        localUsers.push({
          id: res.data.user?.id || 'usr_' + Date.now(),
          name: trimmedName,
          email: trimmedEmail,
          password,
        });
        saveLocalUsers(localUsers);
        window.dispatchEvent(new Event('auth-changed'));
        return res.data;
      }
    } catch (err) {
      console.warn('Backend register failed or unreachable. Falling back to local authentication:', err.message);
      if (err.message && (err.message.includes('already registered') || err.message.includes('exists'))) {
        throw new Error('An account with this email address already exists. Please log in.');
      }
    }

    // Local registration fallback
    const newUser = {
      id: 'usr_' + Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      password,
      createdAt: new Date().toISOString(),
    };
    localUsers.push(newUser);
    saveLocalUsers(localUsers);

    const token = 'token_local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const userPayload = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('contractai_token', token);
    localStorage.setItem('contractai_user', JSON.stringify(userPayload));
    window.dispatchEvent(new Event('auth-changed'));

    return { access_token: token, user: userPayload };
  },

  async login(email, password) {
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (!trimmedEmail) {
      throw new Error('Please enter your email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    // Attempt backend login first
    try {
      const res = await api.post('/auth/login', { email: trimmedEmail, password });
      if (res.data.access_token) {
        localStorage.setItem('contractai_token', res.data.access_token);
        localStorage.setItem('contractai_user', JSON.stringify(res.data.user));
        window.dispatchEvent(new Event('auth-changed'));
        return res.data;
      }
    } catch (err) {
      console.warn('Backend login failed or unreachable. Checking local accounts:', err.message);
      // If error is specific wrong password from backend, throw it unless local user matches
      if (err.message && err.message.includes('Invalid credentials')) {
        // Let's verify local store before giving up
      }
    }

    // Verify against local user accounts
    const localUsers = getLocalUsers();
    const foundUser = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (foundUser) {
      if (foundUser.password !== password) {
        throw new Error('Incorrect password. Please verify your credentials.');
      }
      const token = 'token_local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      const userPayload = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      localStorage.setItem('contractai_token', token);
      localStorage.setItem('contractai_user', JSON.stringify(userPayload));
      window.dispatchEvent(new Event('auth-changed'));
      return { access_token: token, user: userPayload };
    }

    throw new Error('No account found with this email. Please check your email or register a new account.');
  },

  async getMe() {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch {
      return this.getCurrentUser();
    }
  },

  logout() {
    localStorage.removeItem('contractai_token');
    localStorage.removeItem('contractai_user');
    window.dispatchEvent(new Event('auth-changed'));
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('contractai_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('contractai_token') && !!localStorage.getItem('contractai_user');
  }
};

export const contractService = {
  async uploadPdf(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/contracts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch {
      // Offline fallback: read file as text and store locally
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result || '';
          const contractId = 'local_' + Date.now();
          localStorage.setItem(
            'contractai_pending_contract_' + contractId,
            JSON.stringify({ text, filename: file.name })
          );
          resolve({ id: contractId, filename: file.name, page_count: 1 });
        };
        reader.onerror = () => reject(new Error('Failed to read the uploaded file.'));
        reader.readAsText(file);
      });
    }
  },

  async uploadText(text, filename = 'Pasted_Agreement.txt') {
    try {
      const res = await api.post('/contracts/upload-text', { text, filename });
      return res.data;
    } catch {
      // Offline fallback: store text locally
      const contractId = 'local_' + Date.now();
      localStorage.setItem(
        'contractai_pending_contract_' + contractId,
        JSON.stringify({ text, filename })
      );
      return { id: contractId, filename, page_count: 1 };
    }
  },

  async getSample(sampleType = 'internship') {
    try {
      const res = await api.get(`/contracts/sample/${sampleType}`);
      return res.data;
    } catch {
      // Offline fallback: use built-in sample texts
      const text = OFFLINE_SAMPLE_TEXTS[sampleType] || OFFLINE_SAMPLE_TEXTS.internship;
      const filename = sampleType === 'hostel'
        ? 'Sample_Hostel_Agreement.txt'
        : 'Sample_Internship_Agreement.txt';
      const contractId = 'local_sample_' + Date.now();
      localStorage.setItem(
        'contractai_pending_contract_' + contractId,
        JSON.stringify({ text, filename })
      );
      return { id: contractId, filename, page_count: 2 };
    }
  },
};

export const analysisService = {
  async triggerAnalysis(contractId) {
    try {
      const res = await api.post(`/analysis/${contractId}`);
      // Cache result locally for offline access
      offlineDemoService.saveAnalysis(res.data);
      return res.data;
    } catch {
      // Offline fallback: run local rule-based engine
      console.warn('[ContractAI] Backend unavailable — using local analysis engine');
      const pendingKey = 'contractai_pending_contract_' + contractId;
      const pending = JSON.parse(localStorage.getItem(pendingKey) || '{}');
      if (pending.text) {
        localStorage.removeItem(pendingKey);
        return offlineDemoService.analyzeContractText(pending.text, pending.filename);
      }
      // If it's a pre-seeded demo analysis ID, return it directly
      const demoResult = offlineDemoService.getAnalysis(contractId);
      if (demoResult) return demoResult;
      throw new Error('Backend unavailable. No contract text found for offline analysis. Please re-upload the document.');
    }
  },

  async getAnalysis(analysisId) {
    // Check local cache first (fast path)
    const local = offlineDemoService.getAnalysis(analysisId);
    if (local) return local;
    // Then try backend
    try {
      const res = await api.get(`/analysis/${analysisId}`);
      offlineDemoService.saveAnalysis(res.data);
      return res.data;
    } catch {
      throw new Error('Analysis not found — not available locally or on the server.');
    }
  },

  async getHistory() {
    const local = offlineDemoService.getAnalysisHistory();
    try {
      const res = await api.get('/analysis/history');
      const backend = Array.isArray(res.data) ? res.data : [];
      // Merge and deduplicate by ID
      const merged = [...local];
      backend.forEach((b) => {
        if (!merged.some((l) => l.id === b.id)) merged.push(b);
      });
      return merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch {
      return local.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },

  async deleteAnalysis(analysisId) {
    offlineDemoService.deleteAnalysis(analysisId);
    try {
      await api.delete(`/analysis/${analysisId}`);
    } catch {
      // Ignore backend errors — local deletion already done
    }
    return { deleted: true };
  },

  getPdfReportUrl(analysisId) {
    return `/api/reports/${analysisId}/pdf`;
  },

  async downloadPdfReport(analysisId, filename = 'ContractAI_Report.pdf') {
    try {
      const response = await api.get(`/reports/${analysisId}/pdf`, {
        responseType: 'blob',
        timeout: 5000,
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Offline fallback: generate and download a plain-text report
      const analysis = offlineDemoService.getAnalysis(analysisId);
      if (!analysis) {
        alert('Report not available. Please re-run the analysis first.');
        return;
      }
      const reportText = offlineDemoService.generateTextReport(analysis);
      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = (filename.replace(/\.pdf$/i, '') || 'ContractAI_Report');
      link.setAttribute('download', `${safeName}_Offline_Report.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },

  async askContractQuestion(analysisId, message, history = []) {
    try {
      const res = await api.post(`/analysis/${analysisId}/chat`, { message, history });
      return res.data;
    } catch {
      // Offline fallback: keyword-match against cached findings
      const analysis = offlineDemoService.getAnalysis(analysisId);
      const lowerMsg = message.toLowerCase();
      let reply = 'I could not find a specific clause matching your question in this analysis. Please ask about specific topics like "notice period", "salary", "non-compete", or "confidentiality".';
      const citations = [];

      if (analysis?.findings?.length) {
        const relevant = analysis.findings.filter((f) =>
          f.category.toLowerCase().includes(lowerMsg) ||
          f.title.toLowerCase().includes(lowerMsg) ||
          lowerMsg.split(' ').some(
            (word) => word.length > 3 && (
              f.original_clause?.toLowerCase().includes(word) ||
              f.simple_explanation?.toLowerCase().includes(word)
            )
          )
        );
        if (relevant.length > 0) {
          reply = relevant
            .map((f) => `**${f.title}** (${f.category}, ${f.importance} Priority)\n${f.simple_explanation}`)
            .join('\n\n');
          citations.push(
            ...relevant.map((f) => ({
              title: f.title,
              clause: (f.original_clause || '').slice(0, 120),
            }))
          );
        }
      }

      return {
        reply,
        citations,
        engine_used: 'offline_heuristics',
        suggested_followups: [
          'What is the notice period?',
          'What are the financial penalties?',
          'Who owns the intellectual property?',
          'What are my working hours?',
          'What happens if I leave early?',
        ],
      };
    }
  },
};

export default api;
