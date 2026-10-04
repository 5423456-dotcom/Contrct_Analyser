// Local Contact Intelligence & Rule-Based Analysis Engine for Students

const DEMO_CONTACTS = [
  {
    id: 'cnt_1',
    name: 'Dr. Ramesh Kulkarni',
    email: 'kulkarni.cs@university.edu',
    phone: '+91 98201 12345',
    category: 'Professor / Faculty',
    tags: ['Project Guide', 'Recommendation Letter', 'High Priority'],
    lastInteraction: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 42 days ago
    interactionFrequency: 'Monthly',
    priority: 'High',
    notes: 'Thesis supervisor. Need to follow up regarding final semester internship NOC and letter of recommendation.',
  },
  {
    id: 'cnt_2',
    name: 'Priya Sharma',
    email: 'priya.sharma@techcorp.in',
    phone: '+91 98450 54321',
    category: 'Recruiter / HR',
    tags: ['Summer Internship', 'Offer Letter', 'Urgent Followup'],
    lastInteraction: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days ago
    interactionFrequency: 'Weekly',
    priority: 'High',
    notes: 'HR Manager at TechCorp. Discussed stipend terms and remote onboarding schedule.',
  },
  {
    id: 'cnt_3',
    name: 'Vikram Mehta',
    email: 'vikram.m@innovatelabs.io',
    phone: '+91 97110 88990',
    category: 'Internship Mentor',
    tags: ['Tech Mentor', 'Code Review'],
    lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
    interactionFrequency: 'Daily',
    priority: 'High',
    notes: 'Senior Engineering Mentor. Weekly 1-on-1 sprint review scheduled every Tuesday.',
  },
  {
    id: 'cnt_4',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@university.edu',
    phone: '+91 91234 56780',
    category: 'Peer / Student',
    tags: ['Hackathon Teammate', 'Study Group'],
    lastInteraction: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
    interactionFrequency: 'Daily',
    priority: 'Medium',
    notes: 'Lead frontend developer for hackathon project submission.',
  },
  {
    id: 'cnt_5',
    name: 'Suresh Patil (Hostel Warden)',
    email: 'warden.boyshostel@university.edu',
    phone: '+91 94220 33445',
    category: 'Landlord / PG Warden',
    tags: ['Hostel Lease', 'Security Deposit'],
    lastInteraction: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 65 days ago
    interactionFrequency: 'Rarely',
    priority: 'Medium',
    notes: 'Hostel warden. Need to submit curfew extension form and security deposit refund receipt.',
  },
  {
    id: 'cnt_6',
    name: 'Sneha Patel',
    email: 'sneha.patel@alumni.edu',
    phone: '+91 99880 77665',
    category: 'Alumni',
    tags: ['Referral', 'Career Guidance'],
    lastInteraction: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 50 days ago
    interactionFrequency: 'Rarely',
    priority: 'High',
    notes: 'Working as SWE II at Microsoft. Promised an employee referral for graduate trainee roles.',
  },
  {
    id: 'cnt_7',
    name: 'Arjun Rao',
    email: 'arjun.rao@talentbridge.co',
    phone: '',
    category: 'Recruiter / HR',
    tags: ['Campus Placement', 'Missing Phone'],
    lastInteraction: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days ago
    interactionFrequency: 'Bi-weekly',
    priority: 'Medium',
    notes: 'Campus recruiter. Reached out on LinkedIn for technical assessment round 2.',
  },
  {
    id: 'cnt_8',
    name: 'Priya Sharma (Duplicate)',
    email: 'priya.sharma@techcorp.in',
    phone: '+91 98450 54321',
    category: 'Recruiter / HR',
    tags: ['Duplicate Alert'],
    lastInteraction: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    interactionFrequency: 'Rarely',
    priority: 'Low',
    notes: 'Duplicate contact record created during campus job fair.',
  },
];

const STORAGE_KEY = 'contractai_student_contacts';

export const contactService = {
  getContacts() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CONTACTS));
      return DEMO_CONTACTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEMO_CONTACTS;
    }
  },

  saveContacts(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  },

  addContact(contact) {
    const contacts = this.getContacts();
    const newContact = {
      ...contact,
      id: 'cnt_' + Date.now(),
      lastInteraction: contact.lastInteraction || new Date().toISOString().split('T')[0],
      priority: contact.priority || 'Medium',
      tags: Array.isArray(contact.tags)
        ? contact.tags
        : typeof contact.tags === 'string'
        ? contact.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };
    contacts.unshift(newContact);
    this.saveContacts(contacts);
    return newContact;
  },

  updateContact(id, updatedFields) {
    const contacts = this.getContacts();
    const index = contacts.findIndex((c) => c.id === id);
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updatedFields };
      this.saveContacts(contacts);
      return contacts[index];
    }
    return null;
  },

  deleteContact(id) {
    const contacts = this.getContacts();
    const filtered = contacts.filter((c) => c.id !== id);
    this.saveContacts(filtered);
    return filtered;
  },

  resetToDemo() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CONTACTS));
    return DEMO_CONTACTS;
  },

  // Parse CSV string into contact objects
  importCsv(csvText) {
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      throw new Error('CSV file is empty or does not contain header and data rows.');
    }

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
    const nameIdx = header.findIndex((h) => h.includes('name'));
    const emailIdx = header.findIndex((h) => h.includes('email'));
    const phoneIdx = header.findIndex((h) => h.includes('phone') || h.includes('mobile'));
    const categoryIdx = header.findIndex((h) => h.includes('cat') || h.includes('role') || h.includes('type'));
    const lastInteractionIdx = header.findIndex((h) => h.includes('last') || h.includes('date'));
    const freqIdx = header.findIndex((h) => h.includes('freq'));
    const priorityIdx = header.findIndex((h) => h.includes('priority'));
    const notesIdx = header.findIndex((h) => h.includes('note'));

    if (nameIdx === -1 && emailIdx === -1) {
      throw new Error('CSV must contain at least a "Name" or "Email" column.');
    }

    const newContacts = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      if (row.length === 0 || !row.some((cell) => cell.length > 0)) continue;

      const name = nameIdx !== -1 ? row[nameIdx] : 'Unknown';
      const email = emailIdx !== -1 ? row[emailIdx] : '';
      const phone = phoneIdx !== -1 ? row[phoneIdx] : '';
      const category = categoryIdx !== -1 && row[categoryIdx] ? row[categoryIdx] : 'Peer / Student';
      const lastInteraction = lastInteractionIdx !== -1 && row[lastInteractionIdx] ? row[lastInteractionIdx] : new Date().toISOString().split('T')[0];
      const interactionFrequency = freqIdx !== -1 && row[freqIdx] ? row[freqIdx] : 'Monthly';
      const priority = priorityIdx !== -1 && row[priorityIdx] ? row[priorityIdx] : 'Medium';
      const notes = notesIdx !== -1 && row[notesIdx] ? row[notesIdx] : '';

      newContacts.push({
        id: 'cnt_' + (Date.now() + i),
        name: name || 'Contact ' + i,
        email,
        phone,
        category,
        tags: ['Imported CSV'],
        lastInteraction,
        interactionFrequency,
        priority,
        notes,
      });
    }

    const current = this.getContacts();
    const combined = [...newContacts, ...current];
    this.saveContacts(combined);
    return { addedCount: newContacts.length, total: combined.length };
  },

  // Export contacts as CSV
  exportCsv() {
    const contacts = this.getContacts();
    const headers = ['Name', 'Email', 'Phone', 'Category', 'Tags', 'Last Interaction', 'Frequency', 'Priority', 'Notes'];
    const rows = contacts.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${c.category || ''}"`,
      `"${(c.tags || []).join(';')}"`,
      `"${c.lastInteraction || ''}"`,
      `"${c.interactionFrequency || ''}"`,
      `"${c.priority || ''}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },

  // Local Rule-Based AI Contact Analytics Engine
  analyzeContacts(contacts) {
    const now = new Date();
    const totalContacts = contacts.length;

    let activeCount = 0;
    let inactiveCount = 0;
    let highPriorityCount = 0;
    let missingInfoCount = 0;

    const categoryMap = {};
    const frequencyMap = {};
    const inactiveHighPriority = [];
    const duplicates = [];

    // Track for duplicate detection
    const emailSeen = new Map();
    const phoneSeen = new Map();
    const nameSeen = new Map();

    contacts.forEach((c) => {
      // Days since last interaction
      let daysAgo = 999;
      if (c.lastInteraction) {
        const lastDate = new Date(c.lastInteraction);
        if (!isNaN(lastDate.getTime())) {
          daysAgo = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
        }
      }

      const isActive = daysAgo <= 30 && c.interactionFrequency !== 'Rarely';
      if (isActive) {
        activeCount++;
      } else {
        inactiveCount++;
      }

      if (c.priority === 'High') {
        highPriorityCount++;
        if (daysAgo > 30) {
          inactiveHighPriority.push({ contact: c, daysAgo });
        }
      }

      if (!c.email || !c.phone) {
        missingInfoCount++;
      }

      // Categories
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;

      // Frequency
      frequencyMap[c.interactionFrequency] = (frequencyMap[c.interactionFrequency] || 0) + 1;

      // Duplicate Check
      if (c.email) {
        const lowerEmail = c.email.toLowerCase();
        if (emailSeen.has(lowerEmail)) {
          duplicates.push({
            reason: 'Identical Email',
            value: c.email,
            contact1: emailSeen.get(lowerEmail),
            contact2: c,
          });
        } else {
          emailSeen.set(lowerEmail, c);
        }
      }

      if (c.phone) {
        const cleanPhone = c.phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length >= 8) {
          if (phoneSeen.has(cleanPhone)) {
            duplicates.push({
              reason: 'Identical Phone Number',
              value: c.phone,
              contact1: phoneSeen.get(cleanPhone),
              contact2: c,
            });
          } else {
            phoneSeen.set(cleanPhone, c);
          }
        }
      }

      const lowerName = c.name.toLowerCase().trim();
      if (nameSeen.has(lowerName)) {
        duplicates.push({
          reason: 'Identical Name',
          value: c.name,
          contact1: nameSeen.get(lowerName),
          contact2: c,
        });
      } else {
        nameSeen.set(lowerName, c);
      }
    });

    // Deduplicate duplicate alerts
    const uniqueDuplicatePairs = [];
    const seenPairs = new Set();
    duplicates.forEach((d) => {
      const pairKey = [d.contact1.id, d.contact2.id].sort().join('_');
      if (!seenPairs.has(pairKey)) {
        seenPairs.add(pairKey);
        uniqueDuplicatePairs.push(d);
      }
    });

    // Calculate Network Health Score (0 - 100)
    let healthScore = 75;
    if (totalContacts > 0) {
      const activeRatio = activeCount / totalContacts;
      const atRiskDeduction = (inactiveHighPriority.length / (highPriorityCount || 1)) * 30;
      const duplicateDeduction = Math.min(20, uniqueDuplicatePairs.length * 10);
      healthScore = Math.max(10, Math.min(100, Math.round(activeRatio * 60 + 30 - atRiskDeduction - duplicateDeduction)));
    }

    // AI Generated Insights and Actionable Recommendations
    const aiRecommendations = [];

    if (inactiveHighPriority.length > 0) {
      aiRecommendations.push({
        type: 'critical',
        title: `${inactiveHighPriority.length} High-Priority Contacts Need Attention`,
        description: `Key relationships like ${inactiveHighPriority[0].contact.name} (${inactiveHighPriority[0].contact.category}) have not been reached in over ${inactiveHighPriority[0].daysAgo} days. Send a check-in message to keep the connection warm.`,
        actionText: 'Reach Out Now',
      });
    }

    if (uniqueDuplicatePairs.length > 0) {
      aiRecommendations.push({
        type: 'warning',
        title: `${uniqueDuplicatePairs.length} Potential Duplicate Contact Records Detected`,
        description: `Clean up redundant entries (e.g., "${uniqueDuplicatePairs[0].contact1.name}") to prevent fragmented interaction histories and duplicate outreach.`,
        actionText: 'Review Duplicates',
      });
    }

    if (categoryMap['Recruiter / HR'] && (!categoryMap['Internship Mentor'] || categoryMap['Internship Mentor'] === 0)) {
      aiRecommendations.push({
        type: 'growth',
        title: 'Expand Engineering & Technical Mentor Network',
        description: 'You have recruiters recorded, but no direct engineering mentors. Connecting with alumni mentors boosts your internship interview conversion by 4x.',
        actionText: 'Add Mentor',
      });
    }

    if (missingInfoCount > 0) {
      aiRecommendations.push({
        type: 'info',
        title: `${missingInfoCount} Contacts Missing Phone or Email Details`,
        description: 'Ensure you have backup contact channels for important faculty, recruiters, and hostel authorities before exams or internship start dates.',
        actionText: 'Update Contacts',
      });
    }

    aiRecommendations.push({
      type: 'tip',
      title: 'Optimal Student Networking Cadence',
      description: 'Interact with faculty once every 3 weeks and recruitment leads once every 10-14 days during hiring seasons to stay top of mind.',
      actionText: 'View Schedule',
    });

    return {
      totalContacts,
      activeCount,
      inactiveCount,
      highPriorityCount,
      missingInfoCount,
      healthScore,
      categoryBreakdown: categoryMap,
      frequencyBreakdown: frequencyMap,
      inactiveHighPriority,
      duplicates: uniqueDuplicatePairs,
      aiRecommendations,
    };
  },
};
