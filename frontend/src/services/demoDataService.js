// Offline Demo Data Service for ContractAI
// ALL data is stored in localStorage. No internet required.

export const OFFLINE_DEMO_CONTACTS = [
  // ---- TEACHERS ----
  { id: 'd1', name: 'Dr. Ramesh Kulkarni', email: 'kulkarni.cs@university.edu', phone: '+91 98201 12345', category: 'Teachers', tags: ['Project Guide', 'Recommendation Letter', 'High Priority'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 42); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Monthly', priority: 'High', notes: 'Thesis supervisor. Follow up for final semester internship NOC and recommendation letter.' },
  { id: 'd2', name: 'Prof. Anita Joshi', email: 'anita.joshi@university.edu', phone: '+91 98330 44556', category: 'Teachers', tags: ['Examiner', 'Elective Guide', 'ML Project'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 18); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Monthly', priority: 'Medium', notes: 'ML elective project mentor. Exam scheduled in 3 weeks.' },
  { id: 'd3', name: 'Dr. Suresh Menon (HoD)', email: 'suresh.menon@university.edu', phone: '+91 97110 23456', category: 'Teachers', tags: ['HoD', 'Clearance', 'Graduation NOC'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 60); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Rarely', priority: 'High', notes: 'Head of Department. Need clearance form signed before graduation.' },
  // ---- COLLEGE ----
  { id: 'd4', name: 'Student Affairs Office', email: 'studentaffairs@university.edu', phone: '+91 20 2233 4455', category: 'College', tags: ['Bonafide', 'Scholarship', 'NOC'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Monthly', priority: 'Medium', notes: 'Contact for bonafide certificate and scholarship documents.' },
  { id: 'd5', name: 'Training & Placement Cell', email: 'tnp@university.edu', phone: '+91 20 2233 5566', category: 'College', tags: ['Placement', 'On-Campus', 'Resume Submission'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Weekly', priority: 'High', notes: 'Coordinates campus placement drives. Resume submission deadline Nov 15.' },
  { id: 'd6', name: 'Library (No-Due Clearance)', email: 'library@university.edu', phone: '', category: 'College', tags: ['Books', 'No Due Certificate'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 90); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Rarely', priority: 'Low', notes: 'No due clearance needed before semester end. 1 overdue book.' },
  // ---- FRIENDS ----
  { id: 'd7', name: 'Ananya Deshmukh', email: 'ananya.d@gmail.com', phone: '+91 91234 56780', category: 'Friends', tags: ['Hackathon Teammate', 'Study Group', 'Frontend Dev'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Daily', priority: 'Medium', notes: 'Lead frontend developer for hackathon project.' },
  { id: 'd8', name: 'Rohan Mehta', email: 'rohan.m@gmail.com', phone: '+91 92345 67891', category: 'Friends', tags: ['Study Partner', 'Backend Dev', 'Weekly Meeting'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 2); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Daily', priority: 'Low', notes: 'Backend partner for mini project. Study group every Sunday 10AM.' },
  { id: 'd9', name: 'Preethi Kumar', email: 'preethi.k@gmail.com', phone: '+91 93456 78902', category: 'Friends', tags: ['Design', 'UI/UX', 'PPT Help'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 5); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Weekly', priority: 'Low', notes: 'Helps with design and presentations. Available on weekends.' },
  { id: 'd10', name: 'Kabir Sethi', email: 'kabir.s@gmail.com', phone: '+91 94321 09876', category: 'Friends', tags: ['Notes Sharing', 'Same Branch', 'Attendance Buddy'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Daily', priority: 'Low', notes: 'Same branch friend. Shares notes and assignment solutions.' },
  // ---- INTERNSHIP ----
  { id: 'd11', name: 'Vikram Mehta (Tech Mentor)', email: 'vikram.m@innovatelabs.io', phone: '+91 97110 88990', category: 'Internship', tags: ['Tech Mentor', 'Code Review', 'Sprint Review'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 2); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Daily', priority: 'High', notes: 'Senior Engineering Mentor. Weekly 1-on-1 every Tuesday.' },
  { id: 'd12', name: 'Priya Sharma (HR)', email: 'priya.sharma@techcorp.in', phone: '+91 98450 54321', category: 'Internship', tags: ['Stipend', 'Offer Letter', 'Onboarding', 'HR'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 4); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Weekly', priority: 'High', notes: 'HR Manager at TechCorp. Stipend INR 15000/month. Review notice period clause.' },
  { id: 'd13', name: 'Kiran Nair (Manager)', email: 'kiran.nair@techcorp.in', phone: '', category: 'Internship', tags: ['Manager', 'Project Lead', 'Missing Phone'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 8); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Weekly', priority: 'High', notes: 'Direct reporting manager. Weekly status report due every Friday.' },
  // ---- PLACEMENT ----
  { id: 'd14', name: 'Arjun Rao (TalentBridge)', email: 'arjun.rao@talentbridge.co', phone: '+91 97634 12309', category: 'Placement', tags: ['Campus Recruiter', 'Technical Round 2'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 15); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Bi-weekly', priority: 'Medium', notes: 'Campus recruiter. Technical assessment round 2 scheduled.' },
  { id: 'd15', name: 'Sneha Patel (Microsoft)', email: 'sneha.patel@alumni.edu', phone: '+91 99880 77665', category: 'Placement', tags: ['Alumni Referral', 'SWE II', 'High Priority'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 50); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Rarely', priority: 'High', notes: 'Working at Microsoft. Promised employee referral. URGENT: Follow up!' },
  { id: 'd16', name: 'Infosys Campus HR', email: 'campus.hr@infosys.com', phone: '+91 80 4116 4116', category: 'Placement', tags: ['Mass Recruiter', 'Campus Drive', 'Service Bond'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 20); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Monthly', priority: 'Medium', notes: 'Infosys campus drive. 18-month bond clause in offer letter - review before signing.' },
  // ---- HACKATHON ----
  { id: 'd17', name: 'Devraj Singh (Team Lead)', email: 'devraj.s@hackmail.com', phone: '+91 91112 34567', category: 'Hackathon', tags: ['Team Lead', 'Full Stack', 'SIH 2026'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 3); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Daily', priority: 'High', notes: 'Team leader for Smart India Hackathon 2026. Demo Oct 5.' },
  { id: 'd18', name: 'Meera Krishnan (ML)', email: 'meera.k@hackmail.com', phone: '+91 94445 67890', category: 'Hackathon', tags: ['ML Engineer', 'AI Pipeline', 'SIH 2026'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Daily', priority: 'High', notes: 'ML teammate for hackathon. Check in before 11 PM daily.' },
  // ---- PROFESSIONAL ----
  { id: 'd19', name: 'Suresh Patil (Hostel Warden)', email: 'warden.boyshostel@university.edu', phone: '+91 94220 33445', category: 'Professional', tags: ['Hostel', 'PG Agreement', 'Security Deposit'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 65); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Rarely', priority: 'Medium', notes: 'Hostel warden. Security deposit refund pending. Curfew extension form needed.' },
  { id: 'd20', name: 'CA Ravi Deora', email: 'ravi.deora@taxfirm.co.in', phone: '+91 98765 01234', category: 'Professional', tags: ['Chartered Accountant', 'ITR Filing', 'Tax'], lastInteraction: (() => { const d = new Date(); d.setDate(d.getDate() - 120); return d.toISOString().split('T')[0]; })(), interactionFrequency: 'Rarely', priority: 'Low', notes: 'CA for student ITR filing. Next ITR deadline: July 31.' },
];

// Demo contract analysis results (pre-computed, no API needed)
const DEMO_ANALYSES = [
  {
    id: 'demo_analysis_1',
    contract_id: 'demo_contract_1',
    filename: 'TechCorp_Internship_Agreement.pdf',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    page_count: 4,
    summary_preview: 'A 6-month internship with 30-day notice, INR 15,000 stipend, non-compete clause, and IP assignment.',
    summary: 'This internship agreement binds you to TechCorp for 6 months at INR 15,000/month. Key risks include a 30-day mandatory notice period, full IP assignment for all work created, a 12-month non-compete after leaving, and a INR 25,000 confidentiality breach penalty. Review carefully before signing.',
    overall_duration: '6 Months',
    key_points: [
      '30-day written notice required before resignation',
      'Stipend: INR 15,000/month paid by 7th of following month',
      'All work created is owned by TechCorp (IP Assignment)',
      '12-month non-compete restriction post-internship',
      'Confidentiality breach penalty: INR 25,000',
    ],
    findings: [
      { id: 'f1', category: 'Notice Period', importance: 'High', title: 'Mandatory 30-Day Written Notice', original_clause: 'The Intern shall provide a minimum thirty (30) days written notice prior to termination of this engagement. Failure to provide adequate notice shall result in forfeiture of the final month stipend.', simple_explanation: 'You must give 30 days written notice before leaving. Quitting without notice = you lose your last month stipend.', page_number: 1 },
      { id: 'f2', category: 'Salary/Stipend', importance: 'High', title: 'Stipend: INR 15,000/Month', original_clause: 'The Company shall pay the Intern a monthly stipend of INR 15,000 (Rupees Fifteen Thousand Only), disbursed on or before the 7th working day of the following month.', simple_explanation: 'You get INR 15,000 per month, paid by the 7th of the next month.', page_number: 1 },
      { id: 'f3', category: 'Intellectual Property', importance: 'High', title: 'IP Assignment — All Work Belongs to Company', original_clause: 'Any work product, code, designs, or inventions created by the Intern during the course of the internship shall be the exclusive property of the Company.', simple_explanation: 'Everything you create during this internship legally belongs to TechCorp — including code and designs.', page_number: 2 },
      { id: 'f4', category: 'Non-compete', importance: 'High', title: '12-Month Non-Compete Restriction', original_clause: 'For a period of twelve (12) months following the termination of this Agreement, Intern agrees not to engage with any direct competitor of the Company.', simple_explanation: 'For 1 year after your internship ends, you cannot work at a direct competitor of TechCorp.', page_number: 2 },
      { id: 'f5', category: 'Confidentiality', importance: 'Medium', title: 'Confidentiality Obligation', original_clause: 'The Intern shall maintain strict confidentiality of all proprietary information, trade secrets, and business strategies.', simple_explanation: 'You cannot share company information with anyone — even after leaving.', page_number: 3 },
      { id: 'f6', category: 'Penalty/Fine', importance: 'High', title: 'INR 25,000 Confidentiality Breach Penalty', original_clause: 'Breach of confidentiality obligations shall entitle the Company to claim liquidated damages of INR 25,000.', simple_explanation: 'If you share confidential information, you may owe the company INR 25,000.', page_number: 3 },
      { id: 'f7', category: 'Working Hours', importance: 'Medium', title: '9-Hour Workday, Mon–Fri', original_clause: 'The Intern shall be available Monday through Friday, 9:00 AM to 6:00 PM, with a 1-hour lunch break.', simple_explanation: 'Work hours are 9 AM to 6 PM, Monday to Friday. Lunch break is unpaid.', page_number: 1 },
      { id: 'f8', category: 'Termination', importance: 'Medium', title: 'Company Can Terminate with 7-Day Notice', original_clause: 'The Company reserves the right to terminate this Agreement with seven (7) days written notice.', simple_explanation: 'TechCorp can end your internship with just 7 days notice — while you need 30 days. Asymmetric.', page_number: 4 },
    ],
    student_obligations: {
      what_you_need_to_pay: [],
      what_you_need_to_do: ['Provide 30 days written notice before leaving', 'Report Mon–Fri 9AM–6PM', 'Submit weekly progress reports every Friday', 'Maintain strict confidentiality'],
      what_you_cannot_do: ['Work for a direct competitor for 12 months post-internship', 'Share any company data or business info', 'Use company IP for personal projects'],
      when_you_need_to_give_notice: ['30 calendar days written notice required before resignation'],
      what_happens_if_you_cancel_or_leave_early: ['Final stipend forfeited', 'INR 25,000 fine for confidentiality breach'],
      important_deadlines: ['Notice must be submitted to HR in writing', 'Stipend paid by 7th of following month'],
    },
  },
  {
    id: 'demo_analysis_2',
    contract_id: 'demo_contract_2',
    filename: 'University_Hostel_Agreement.pdf',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    page_count: 2,
    summary_preview: 'Semester hostel agreement with INR 5,000 deposit, 11 PM curfew, and forfeiture on early exit.',
    summary: 'Standard university hostel agreement for one academic semester. Security deposit of INR 5,000 is refundable on proper checkout with 30-day notice. Monthly fees of INR 8,000 are due by the 5th. Curfew and visitor rules are strictly enforced. Early departure without proper notice leads to full deposit forfeiture.',
    overall_duration: '1 Semester (6 Months)',
    key_points: [
      'Security Deposit: INR 5,000 (refundable on checkout)',
      'Monthly fees: INR 8,000 due by 5th of each month',
      'Curfew: 11:00 PM weekdays, 12:00 AM weekends',
      'Deposit forfeited if room vacated without 30-day notice',
      'No visitors of opposite gender after 8:00 PM',
    ],
    findings: [
      { id: 'h1', category: 'Payment', importance: 'High', title: 'Monthly Hostel Fee: INR 8,000', original_clause: 'The resident shall pay monthly accommodation charges of INR 8,000 on or before the 5th day of each calendar month.', simple_explanation: 'You must pay INR 8,000 by the 5th of every month. Late payment attracts a fine.', page_number: 1 },
      { id: 'h2', category: 'Penalty/Fine', importance: 'High', title: 'Security Deposit Forfeited on Early Exit', original_clause: 'Vacating the hostel room without providing 30-day written notice shall result in forfeiture of the security deposit in full.', simple_explanation: 'If you leave without 30 days notice, your full INR 5,000 deposit is gone.', page_number: 1 },
      { id: 'h3', category: 'Student Obligations', importance: 'Medium', title: 'Curfew: 11 PM on Weekdays', original_clause: 'Residents must return to their rooms by 11:00 PM on weekdays and 12:00 AM on weekends.', simple_explanation: 'Be back in your room by 11 PM on weekdays (midnight on weekends).', page_number: 2 },
      { id: 'h4', category: 'Notice Period', importance: 'High', title: '30-Day Notice to Vacate', original_clause: 'Residents must provide 30 days written notice before vacating the hostel room.', simple_explanation: 'You must formally inform the warden 30 days before you plan to leave.', page_number: 1 },
    ],
    student_obligations: {
      what_you_need_to_pay: ['INR 8,000/month by 5th of each month', 'INR 5,000 security deposit upfront'],
      what_you_need_to_do: ['Follow curfew (11 PM weekdays)', 'Pass monthly room inspection', 'Sign in/out register after 9 PM'],
      what_you_cannot_do: ['No visitors of opposite gender after 8 PM', 'No cooking in room', 'No loud music after 10 PM'],
      when_you_need_to_give_notice: ['30 days written notice before vacating'],
      what_happens_if_you_cancel_or_leave_early: ['Security deposit fully forfeited without 30-day notice'],
      important_deadlines: ['Monthly fees due by 5th of each month', 'Checkout form 30 days in advance'],
    },
  },
];

const CONTACTS_KEY = 'contractai_student_contacts';
const ANALYSES_KEY = 'contractai_offline_analyses';

export const offlineDemoService = {
  // Load full 20-contact demo dataset into localStorage
  loadDemoContacts() {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(OFFLINE_DEMO_CONTACTS));
    return OFFLINE_DEMO_CONTACTS;
  },

  // Seed demo contract analyses into localStorage
  loadDemoAnalyses() {
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(DEMO_ANALYSES));
    return DEMO_ANALYSES;
  },

  // Get all analysis history from localStorage
  getAnalysisHistory() {
    const data = localStorage.getItem(ANALYSES_KEY);
    if (!data) return this.loadDemoAnalyses();
    try { return JSON.parse(data); } catch { return []; }
  },

  // Get single analysis by ID
  getAnalysis(id) {
    const analyses = this.getAnalysisHistory();
    return analyses.find((a) => a.id === id) || null;
  },

  // Save or update an analysis in localStorage
  saveAnalysis(analysis) {
    const analyses = this.getAnalysisHistory();
    const idx = analyses.findIndex((a) => a.id === analysis.id);
    if (idx >= 0) {
      analyses[idx] = analysis;
    } else {
      analyses.unshift(analysis);
    }
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));
    return analysis;
  },

  // Delete analysis from localStorage
  deleteAnalysis(id) {
    const analyses = this.getAnalysisHistory().filter((a) => a.id !== id);
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(analyses));
    return analyses;
  },

  // ============================================================
  // Local Rule-Based Contract Text Analysis Engine
  // Deterministic — no AI API, no internet required
  // ============================================================
  analyzeContractText(text, filename) {
    const lowerText = text.toLowerCase();
    const findings = [];
    let findingId = 1;

    const extractClause = (keyword) => {
      const idx = lowerText.indexOf(keyword);
      if (idx === -1) return null;
      const start = Math.max(0, text.lastIndexOf('.', idx) + 1);
      const end = text.indexOf('.', idx + keyword.length);
      return text.slice(start, end > 0 ? end + 1 : Math.min(text.length, start + 280)).trim();
    };

    const categoryRules = [
      { keywords: ['notice period', 'days notice', 'written notice', 'advance notice', 'days written'], category: 'Notice Period', importance: 'High', title: 'Notice Period Obligation', explain: 'You are required to give advance written notice before leaving. Check the exact number of days required.' },
      { keywords: ['stipend', 'salary', 'compensation', 'remuneration', 'inr ', 'rs.', 'rupees', 'per month', 'monthly payment'], category: 'Salary/Stipend', importance: 'High', title: 'Payment / Stipend Terms', explain: 'Review the payment amount, frequency, and due date carefully. Late payments may be withheld.' },
      { keywords: ['penalty', 'liquidated damage', 'fine', 'forfeit', 'damages of'], category: 'Penalty/Fine', importance: 'High', title: 'Financial Penalty Clause', explain: 'This agreement has a monetary penalty clause. Violating certain terms may cost you money.' },
      { keywords: ['non-compete', 'non compete', 'not compete', 'competing business', 'competitor'], category: 'Non-compete', importance: 'High', title: 'Non-Compete Restriction', explain: 'You may be restricted from working at competitor companies for a period after you leave.' },
      { keywords: ['intellectual property', 'ip rights', 'work product', 'inventions', 'copyright', 'code belongs', 'designs belong'], category: 'Intellectual Property', importance: 'High', title: 'Intellectual Property Assignment', explain: 'All work you create — code, designs, ideas — may legally belong to the company during and after your engagement.' },
      { keywords: ['confidential', 'non-disclosure', 'proprietary information', 'trade secret', 'nda', 'business strategy'], category: 'Confidentiality', importance: 'Medium', title: 'Confidentiality Obligation', explain: 'You cannot share company information with outsiders, even after leaving. This is legally binding.' },
      { keywords: ['terminate', 'termination', 'dismissal', 'end of employment', 'end of engagement'], category: 'Termination', importance: 'Medium', title: 'Termination Conditions', explain: 'Review the conditions under which either party can end this contract, and how much notice they must give.' },
      { keywords: ['lock-in', 'lock in', 'minimum period', 'minimum tenure', 'mandatory period', 'mandatory service'], category: 'Lock-in Period', importance: 'High', title: 'Lock-In Period', explain: 'You may be required to stay for a minimum period or pay a penalty for leaving early.' },
      { keywords: ['auto renew', 'automatically renew', 'auto-renewal', 'rolling basis', 'renewed automatically'], category: 'Auto Renewal', importance: 'Medium', title: 'Automatic Renewal Clause', explain: 'This contract may renew automatically unless you cancel before the deadline.' },
      { keywords: ['working hours', 'work hours', '9:00 am', '9 am to', '6 pm', '8 hours', 'office hours'], category: 'Working Hours', importance: 'Medium', title: 'Working Hours Requirement', explain: 'You are expected to be available during specified hours. Check for overtime or flexibility rules.' },
      { keywords: ['security deposit', 'advance payment', 'refundable deposit', 'deposit of'], category: 'Payment', importance: 'High', title: 'Security Deposit / Advance Payment', explain: 'A deposit is required. Check the exact refund conditions and timeline carefully.' },
      { keywords: ['refund', 'cancellation policy', 'cancel policy', 'no refund'], category: 'Refund Conditions', importance: 'Medium', title: 'Refund & Cancellation Policy', explain: 'Check what happens to your payment if you cancel or exit early.' },
      { keywords: ['curfew', 'return by', 'back by', 'closing time', 'gate closing'], category: 'Student Obligations', importance: 'Medium', title: 'Curfew / Entry Time Restriction', explain: 'There is a specified time by which you must return or check in. Violation may have penalties.' },
    ];

    categoryRules.forEach(({ keywords, category, importance, title, explain }) => {
      for (const kw of keywords) {
        if (lowerText.includes(kw)) {
          const clause = extractClause(kw);
          if (clause && clause.length > 15) {
            findings.push({
              id: `local_f${findingId++}`,
              category,
              importance,
              title,
              original_clause: clause.slice(0, 320),
              simple_explanation: explain,
              page_number: 1,
            });
            break;
          }
        }
      }
    });

    // Build obligations summary from findings
    const obligations = {
      what_you_need_to_pay: [],
      what_you_need_to_do: [],
      what_you_cannot_do: [],
      when_you_need_to_give_notice: [],
      what_happens_if_you_cancel_or_leave_early: [],
      important_deadlines: [],
    };
    findings.forEach((f) => {
      if (['Salary/Stipend', 'Payment'].includes(f.category)) obligations.what_you_need_to_pay.push(f.title);
      if (f.category === 'Notice Period') obligations.when_you_need_to_give_notice.push(f.simple_explanation);
      if (['Non-compete', 'Confidentiality'].includes(f.category)) obligations.what_you_cannot_do.push(f.simple_explanation);
      if (['Working Hours', 'Student Obligations'].includes(f.category)) obligations.what_you_need_to_do.push(f.simple_explanation);
      if (['Penalty/Fine', 'Refund Conditions', 'Lock-in Period'].includes(f.category)) obligations.what_happens_if_you_cancel_or_leave_early.push(f.simple_explanation);
    });

    // Detect document type for context-aware summary
    let docType = 'agreement';
    if (lowerText.includes('internship')) docType = 'internship agreement';
    else if (lowerText.includes('hostel') || lowerText.includes('accommodation')) docType = 'hostel/accommodation agreement';
    else if (lowerText.includes('employment') || lowerText.includes('employee')) docType = 'employment agreement';
    else if (lowerText.includes('freelance') || lowerText.includes('contract work')) docType = 'freelance contract';
    else if (lowerText.includes('coaching') || lowerText.includes('training programme')) docType = 'coaching/course agreement';

    const highCount = findings.filter((f) => f.importance === 'High').length;
    const summary = `This ${docType} contains ${findings.length} identified clauses (${highCount} high-priority). ${
      findings.length > 0
        ? `Key obligations include: ${findings.slice(0, 2).map((f) => f.title).join(', ')}.`
        : 'No specific obligation clauses were automatically detected. Please read the full document carefully.'
    } This analysis was performed by a local rule-based engine — no AI API was used.`;

    const wordCount = text.split(/\s+/).length;
    const pageEstimate = Math.max(1, Math.ceil(wordCount / 300));
    const analysisId = 'local_' + Date.now();

    const result = {
      id: analysisId,
      contract_id: 'local_contract_' + Date.now(),
      filename: filename || 'Pasted_Agreement.txt',
      created_at: new Date().toISOString(),
      page_count: pageEstimate,
      summary_preview: summary.slice(0, 130) + '...',
      summary,
      overall_duration: 'See agreement details',
      key_points: findings.slice(0, 5).map((f) => `${f.title}: ${f.simple_explanation.slice(0, 85)}`),
      findings,
      student_obligations: obligations,
      engine_used: 'offline_rule_engine',
    };

    this.saveAnalysis(result);
    return result;
  },

  // Generate a downloadable plain-text report (works completely offline)
  generateTextReport(analysis) {
    if (!analysis) return '';
    const hr = '='.repeat(62);
    const lines = [
      hr,
      '  ContractAI — Student Contract Analysis Report',
      '  Engine: Local Rule-Based Offline Analysis (No AI API)',
      hr,
      `  File   : ${analysis.filename}`,
      `  Date   : ${new Date(analysis.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}`,
      `  Pages  : ${analysis.page_count}`,
      hr,
      '',
      'EXECUTIVE SUMMARY',
      '-'.repeat(40),
      analysis.summary || '',
      '',
      'KEY POINTS',
      '-'.repeat(40),
      ...(analysis.key_points || []).map((p, i) => `  ${i + 1}. ${p}`),
      '',
      'STUDENT OBLIGATIONS',
      '-'.repeat(40),
      '  What You Need to Pay:',
      ...(analysis.student_obligations?.what_you_need_to_pay?.length
        ? analysis.student_obligations.what_you_need_to_pay.map((o) => `    • ${o}`)
        : ['    • None identified']),
      '  What You Need to Do:',
      ...(analysis.student_obligations?.what_you_need_to_do?.length
        ? analysis.student_obligations.what_you_need_to_do.map((o) => `    • ${o}`)
        : ['    • None identified']),
      '  What You Cannot Do:',
      ...(analysis.student_obligations?.what_you_cannot_do?.length
        ? analysis.student_obligations.what_you_cannot_do.map((o) => `    • ${o}`)
        : ['    • None identified']),
      '  Notice Requirements:',
      ...(analysis.student_obligations?.when_you_need_to_give_notice?.length
        ? analysis.student_obligations.when_you_need_to_give_notice.map((o) => `    • ${o}`)
        : ['    • None identified']),
      '  If You Leave Early:',
      ...(analysis.student_obligations?.what_happens_if_you_cancel_or_leave_early?.length
        ? analysis.student_obligations.what_happens_if_you_cancel_or_leave_early.map((o) => `    • ${o}`)
        : ['    • None identified']),
      '',
      'DETAILED CLAUSE FINDINGS',
      '-'.repeat(40),
      ...(analysis.findings || []).flatMap((f) => [
        `[${f.importance}] ${f.category.toUpperCase()} — ${f.title}`,
        `  Original Clause: "${(f.original_clause || '').slice(0, 160).trim()}..."`,
        `  Plain Language : ${f.simple_explanation}`,
        `  Page Reference : Page ${f.page_number}`,
        '',
      ]),
      hr,
      '  DISCLAIMER: For educational and informational purposes only.',
      '  This is NOT legal advice. Consult a qualified legal professional.',
      hr,
    ];
    return lines.join('\n');
  },
};

// Offline sample contract texts (used when backend is unavailable)
export const OFFLINE_SAMPLE_TEXTS = {
  internship: `DEMO INTERNSHIP OFFER & ENGAGEMENT AGREEMENT
(Fictional Data — Demo Purposes Only)

This Internship Agreement is entered into by TechCorp Solutions Ltd. (the "Company") and the undersigned Intern.

1. DURATION: This internship shall commence on November 1, 2026 and continue for a period of six (6) months.

2. STIPEND: The Company shall pay the Intern a monthly stipend of INR 15,000 (Rupees Fifteen Thousand Only), disbursed on or before the 7th working day of the following month.

3. NOTICE PERIOD: The Intern shall provide a minimum thirty (30) days written notice prior to termination of this engagement. Failure to provide adequate written notice shall result in forfeiture of the final month stipend.

4. WORKING HOURS: The Intern shall be available Monday through Friday, 9:00 AM to 6:00 PM, with a 1-hour unpaid lunch break.

5. CONFIDENTIALITY: The Intern shall maintain strict confidentiality of all proprietary information, trade secrets, client data, and business strategies. Breach of confidentiality obligations shall entitle the Company to claim liquidated damages of INR 25,000.

6. INTELLECTUAL PROPERTY: Any work product, code, designs, or inventions created by the Intern during the course of the internship shall be the exclusive property of the Company.

7. NON-COMPETE: For a period of twelve (12) months following the termination of this Agreement, Intern agrees not to engage with any direct competitor of the Company in a similar capacity.

8. TERMINATION: The Company reserves the right to terminate this Agreement with seven (7) days written notice for cause.`,

  hostel: `UNIVERSITY HOSTEL ACCOMMODATION AGREEMENT
(Fictional Demo Data — Not a Real Agreement)

1. ACCOMMODATION FEES: The resident shall pay monthly accommodation charges of INR 8,000 on or before the 5th day of each calendar month.

2. SECURITY DEPOSIT: A refundable security deposit of INR 5,000 is payable upon check-in and shall be refunded within 30 days of checkout subject to no damage.

3. NOTICE PERIOD: Residents must provide 30 days written notice before vacating the hostel room. Vacating the hostel room without providing 30-day written notice shall result in forfeiture of the security deposit in full.

4. CURFEW: Residents must return to their rooms by 11:00 PM on weekdays and 12:00 AM on weekends. Violation of curfew shall attract a fine of INR 200 per incident.

5. VISITOR POLICY: No visitors of opposite gender are permitted after 8:00 PM. All visitors must register at the reception.

6. CONDUCT: Residents must maintain cleanliness and pass monthly room inspection conducted by the warden.`,
};
