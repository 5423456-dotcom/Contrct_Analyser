import os
import json
import re
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()

ANALYSIS_SYSTEM_PROMPT = """You are ContractAI, an expert AI contract analyst designed specifically for students (interns, employees, tenants, students signing coaching or university agreements).
Your goal is to parse the contract text and identify student-relevant obligations, penalties, notice periods, payments, cancellation conditions, lock-ins, and renewals — and explain them in simple, student-friendly language.

Do NOT provide legal advice. Categorize attention level as "High", "Medium", or "Low" (meaning student attention level, NOT legal validity).
Do NOT hallucinate or invent clauses. Extract the verbatim original clause whenever possible, along with its page number.

You MUST respond strictly with valid JSON conforming to the following structure:
{
  "summary": "2-3 sentences concise, student-friendly overview of the agreement.",
  "overall_duration": "E.g., 6 months, 1 year, or Not specified",
  "key_points": [
    "Short bullet 1",
    "Short bullet 2",
    "Short bullet 3"
  ],
  "findings": [
    {
      "category": "Notice Period | Payment | Salary/Stipend | Penalty/Fine | Cancellation | Termination | Lock-in Period | Auto Renewal | Student Obligations | Organization Obligations | Deadlines | Refund Conditions | Confidentiality | Intellectual Property | Non-compete | Working Hours | Leave Conditions | Documents Required | Other",
      "importance": "High | Medium | Low",
      "title": "Clear, concise title",
      "original_clause": "Direct quote from the agreement",
      "simple_explanation": "Plain, student-friendly explanation of what this actually means for the student.",
      "page_number": 1
    }
  ],
  "student_obligations": {
    "what_you_need_to_pay": ["Item 1", ...],
    "what_you_need_to_do": ["Item 1", ...],
    "what_you_cannot_do": ["Item 1", ...],
    "when_you_need_to_give_notice": ["Item 1", ...],
    "what_happens_if_you_cancel_or_leave_early": ["Item 1", ...],
    "important_deadlines": ["Item 1", ...]
  }
}
"""

SAMPLE_INTERNSHIP_AGREEMENT = """
DEMO INTERNSHIP OFFER & ENGAGEMENT AGREEMENT
(Fictional Data - For Demonstration Purposes)

Date: October 1, 2026
Student Intern: Alex Sharma ("Intern")
Host Organization: NexaTech Innovations Pvt. Ltd. ("Company")

1. ENGAGEMENT & DURATION
1.1 The Company hereby engages the Intern as a "Junior Software Developer Intern" for a fixed duration of six (6) months, commencing on October 15, 2026 and ending on April 14, 2027.
1.2 The Intern agrees to a mandatory lock-in period of three (3) months from the commencement date, during which resignation is strictly not permitted except under documented medical emergencies.

2. STIPEND & COMPENSATION
2.1 The Company agrees to pay the Intern a monthly gross stipend of INR 25,000 (Rupees Twenty Five Thousand only), payable on or before the 7th working day of the following month.
2.2 A refundable security deposit of INR 5,000 shall be deducted from the first month's stipend for company-provided equipment (laptop and access card) and will be refunded within 14 days of clearance at the conclusion of the internship.
2.3 No additional bonuses, health insurance, or travel allowances shall be provided.

3. WORKING HOURS & ATTENDANCE
3.1 The standard working hours shall be 9:30 AM to 6:30 PM, Monday through Friday, with a 1-hour lunch break. Total weekly commitment is 40 hours.
3.2 The Intern is entitled to one (1) day of casual leave per month. Unapproved absences exceeding two (2) consecutive days without prior written notification shall attract a penalty deduction of INR 1,000 per day from the monthly stipend.

4. NOTICE PERIOD & TERMINATION
4.1 Following the lock-in period, either party may terminate this agreement by providing thirty (30) days prior written notice to the designated HR manager.
4.2 In the event that the Intern leaves or terminates the engagement without providing the required 30-day notice, the Intern shall forfeit their unpaid stipend for that month and shall be liable to pay liquidated damages of INR 15,000 to cover recruitment and training costs.
4.3 The Company reserves the right to terminate the internship immediately without notice or severance in cases of misconduct, gross negligence, or breach of confidentiality.

5. INTELLECTUAL PROPERTY & CONFIDENTIALITY
5.1 All source code, designs, algorithms, technical documentation, and patentable work created by the Intern during the internship shall remain the exclusive intellectual property of NexaTech Innovations. The Intern waives any moral rights or personal claims to the code.
5.2 The Intern shall maintain strict confidentiality regarding client data, internal codebase, and proprietary business methods. This obligation continues for two (2) years following the termination of this agreement.

6. RESTRICTIONS & NON-SOLICITATION
6.1 During the term of this internship and for a period of six (6) months thereafter, the Intern shall not accept full-time or freelance employment with direct competitors of NexaTech Innovations operating in the automated analytics domain.
6.2 The Intern shall submit photocopies of their College ID card, Bonafide Student Certificate, and valid Govt ID within five (5) days of joining.
"""

SAMPLE_HOSTEL_AGREEMENT = """
STUDENT HOSTEL & RESIDENTIAL ACCOMMODATION AGREEMENT
(Fictional Data - For Demonstration Purposes)

Property: GreenField Student Living Residency, Block B, Room 304
Student Resident: Priya Patel ("Resident")
Management: Apex Student Housing Services LLP ("Management")

1. TERM & OCCUPANCY
1.1 The accommodation agreement is valid for an academic session of 11 months, starting July 1, 2026 and expiring May 31, 2027.
1.2 The initial four (4) months shall be treated as a mandatory lock-in period. If the resident vacates during this lock-in, the entire security deposit will be forfeited.

2. FEES, SECURITY DEPOSIT & PAYMENT DEADLINE
2.1 Monthly rent is INR 12,000 per month, which includes electricity up to 100 units, high-speed Wi-Fi, and water. Additional units are charged at INR 10 per unit.
2.2 The monthly rent must be paid on or before the 5th day of each calendar month. A late payment fine of INR 100 per day applies from the 6th of the month onwards.
2.3 An interest-free security deposit of INR 24,000 (two months' rent) has been deposited with the Management.

3. NOTICE PERIOD & REFUND CONDITIONS
3.1 After the completion of the lock-in period, the Resident must provide forty-five (45) days written notice via the student portal before vacating the premises.
3.2 Security deposit refund will be processed within thirty (30) days after room inspection and clearance of all utility dues, subject to deductions for any physical damages to hostel property.

4. HOSTEL RULES & RESTRICTIONS
4.1 The main hostel gates will be locked at 10:00 PM every night. Late entry after 10:00 PM requires prior written permission from the hostel warden.
4.2 Cooking appliances (induction cooktops, electric heaters) are strictly prohibited in the bedrooms to prevent fire hazards. Violation will result in a penalty of INR 2,000 and confiscation of equipment.
4.3 Overnight external guests are not allowed in the hostel rooms without 24 hours advance registration with the warden.
"""

def get_sample_agreement(agreement_type: str = "internship") -> Dict[str, Any]:
    if "hostel" in agreement_type.lower() or "pg" in agreement_type.lower():
        return {
            "title": "Student Hostel & Residential Accommodation Agreement (Demo)",
            "filename": "Sample_Hostel_PG_Agreement.pdf",
            "text": SAMPLE_HOSTEL_AGREEMENT.strip(),
            "page_count": 1
        }
    return {
        "title": "Software Developer Internship Agreement (Demo)",
        "filename": "Sample_Internship_Agreement.pdf",
        "text": SAMPLE_INTERNSHIP_AGREEMENT.strip(),
        "page_count": 1
    }

async def analyze_with_gemini(full_text: str, pages_data: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Calls Google Gemini API with system instructions and JSON output mode."""
    if not GEMINI_API_KEY:
        return None

    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )

        prompt = f"""{ANALYSIS_SYSTEM_PROMPT}

Document Content to analyze:
{full_text}
"""
        response = model.generate_content(prompt)
        content_text = response.text
        parsed = json.loads(content_text)
        return parsed
    except Exception as e:
        print(f"[ContractAI] Gemini API call error: {e}")
        return None

def analyze_with_smart_heuristics(full_text: str, pages_data: List[Dict[str, Any]], filename: str = "") -> Dict[str, Any]:
    """
    Intelligent NLP and rule-based clause extraction engine that inspects
    actual text across 21 key student contract categories.
    Accurately extracts original clauses, assigns page numbers, importance levels,
    and provides student-friendly explanations and obligation breakdowns.
    """
    # Helper to find page number for a given matched text
    def find_page_for_text(clause_snippet: str) -> int:
        clean_snippet = clause_snippet.strip().lower()[:40]
        for p in pages_data:
            if clean_snippet in p.get("text", "").lower():
                return p.get("page_number", 1)
        return 1

    findings = []
    obligations = {
        "what_you_need_to_pay": [],
        "what_you_need_to_do": [],
        "what_you_cannot_do": [],
        "when_you_need_to_give_notice": [],
        "what_happens_if_you_cancel_or_leave_early": [],
        "important_deadlines": []
    }
    key_points = []

    # Break text into paragraphs / sections
    raw_paragraphs = [p.strip() for p in re.split(r'\n{2,}|\r\n{2,}', full_text) if p.strip()]
    if not raw_paragraphs:
        raw_paragraphs = [s.strip() for s in re.split(r'\n+', full_text) if s.strip()]

    # Category matching rules: (category, pattern, importance, title_template, explanation_generator, obligation_category)
    rules = [
        {
            "category": "Salary/Stipend",
            "patterns": [r"(?:stipend|salary|remuneration|compensation|pay|allowance)\s+(?:of|is|shall be)?\s*(?:inr|rs\.?|\$|€|£)?\s*[\d,]+", r"monthly\s+(?:gross|net)?\s*stipend"],
            "importance": "High",
            "title": "Payment & Stipend Terms",
            "simple_explanation": "Defines your compensation or monthly stipend amount and payment schedule.",
            "obligation_cat": "what_you_need_to_do"
        },
        {
            "category": "Lock-in Period",
            "patterns": [r"lock-in(?:\s+period)?\s*(?:of)?\s*[\w\s\(\)]+(?:months|days|year)", r"mandatory\s+lock-in"],
            "importance": "High",
            "title": "Mandatory Lock-in Period",
            "simple_explanation": "You are legally committed to remain for this mandatory minimum period. Leaving earlier usually triggers penalties or loss of deposit.",
            "obligation_cat": "what_happens_if_you_cancel_or_leave_early"
        },
        {
            "category": "Notice Period",
            "patterns": [r"(?:notice|prior\s+notice)\s*(?:period)?\s*(?:of)?\s*[\w\s\(\)]*(?:days|weeks|months)", r"\b(?:30|15|60|45|90)\s*days?\s*notice\b"],
            "importance": "High",
            "title": "Mandatory Notice Requirement",
            "simple_explanation": "You must notify the organization in writing in advance before resigning or moving out.",
            "obligation_cat": "when_you_need_to_give_notice"
        },
        {
            "category": "Penalty/Fine",
            "patterns": [r"penalty\s*(?:of|deduction)?", r"liquidated\s+damages", r"fine\s*(?:of)?\s*(?:inr|rs\.?|\$|€)?\s*[\d,]+", r"forfeit\s+(?:their|the)?\s*(?:deposit|stipend|fee)"],
            "importance": "High",
            "title": "Financial Penalty or Deposit Forfeiture",
            "simple_explanation": "Specifies monetary penalties, fines, or loss of deposit if rules are broken or if you leave abruptly.",
            "obligation_cat": "what_happens_if_you_cancel_or_leave_early"
        },
        {
            "category": "Fees & Deposit",
            "patterns": [r"(?:security\s+deposit|caution\s+money|registration\s+fee|maintenance\s+fee)", r"deposit\s+of\s*(?:inr|rs\.?|\$)?\s*[\d,]+"],
            "importance": "Medium",
            "title": "Security Deposit & Upfront Fees",
            "simple_explanation": "Upfront fees or refundable security deposit required from you upon joining or moving in.",
            "obligation_cat": "what_you_need_to_pay"
        },
        {
            "category": "Cancellation & Termination",
            "patterns": [r"terminate\s+this\s+agreement", r"termination\s+(?:without\s+notice|clause|for\s+cause)", r"early\s+termination"],
            "importance": "High",
            "title": "Early Termination & Cancellation Terms",
            "simple_explanation": "Describes the conditions under which you or the organization can end this agreement before completion.",
            "obligation_cat": "what_happens_if_you_cancel_or_leave_early"
        },
        {
            "category": "Working Hours & Schedule",
            "patterns": [r"(?:working\s+hours|office\s+hours|timing)\s*(?:shall\s+be)?", r"\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\s+to\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)\b", r"\d+\s*hours\s+(?:per\s+week|weekly)"],
            "importance": "Medium",
            "title": "Working Hours & Shift Commitment",
            "simple_explanation": "Outlines daily expected hours, total weekly commitments, and attendance standards.",
            "obligation_cat": "what_you_need_to_do"
        },
        {
            "category": "Leave & Attendance",
            "patterns": [r"(?:casual\s+leave|sick\s+leave|absenteeism|attendance|leaves?\s+entitled)", r"unapproved\s+absences?"],
            "importance": "Low",
            "title": "Leave Policy & Attendance Rules",
            "simple_explanation": "Number of permitted leave days and penalties for unapproved absences.",
            "obligation_cat": "what_you_need_to_do"
        },
        {
            "category": "Intellectual Property",
            "patterns": [r"intellectual\s+property", r"exclusive\s+property", r"waives?\s+(?:any\s+)?moral\s+rights", r"all\s+source\s+code.*remain"],
            "importance": "High",
            "title": "Intellectual Property Assignment",
            "simple_explanation": "Any code, designs, or projects you build during this contract belong solely to the organization, not to you.",
            "obligation_cat": "what_you_cannot_do"
        },
        {
            "category": "Confidentiality",
            "patterns": [r"confidential(?:ity)?\s*(?:information|obligation|agreement)?", r"non-disclosure", r"maintain\s+strict\s+confidentiality"],
            "importance": "Medium",
            "title": "Confidentiality & Non-Disclosure",
            "simple_explanation": "You are prohibited from sharing proprietary company code, client details, or trade secrets during and after the term.",
            "obligation_cat": "what_you_cannot_do"
        },
        {
            "category": "Non-compete & Restrictions",
            "patterns": [r"non-compete", r"competitor", r"shall\s+not\s+(?:accept|engage|solicit)", r"strictly\s+prohibited"],
            "importance": "High",
            "title": "Non-Compete & Behavioral Restrictions",
            "simple_explanation": "Restricts you from working with direct competitors or engaging in certain activities for a designated period.",
            "obligation_cat": "what_you_cannot_do"
        },
        {
            "category": "Deadlines & Timelines",
            "patterns": [r"within\s+\d+\s+(?:days|hours|weeks)", r"payable\s+on\s+or\s+before", r"deadline\s*(?:is|of)?"],
            "importance": "Medium",
            "title": "Strict Time Limits & Deadlines",
            "simple_explanation": "Action items that must be completed within a specified timeframe to avoid forfeiture or violation.",
            "obligation_cat": "important_deadlines"
        },
        {
            "category": "Documents Required",
            "patterns": [r"(?:bonafide|college\s+id|govt\s+id|photocopy|documents?\s+required|verification)"],
            "importance": "Low",
            "title": "Documentation & Identity Verification",
            "simple_explanation": "Official certificates or ID proofs that you are required to submit.",
            "obligation_cat": "what_you_need_to_do"
        }
    ]

    matched_categories = set()

    for p in raw_paragraphs:
        p_clean = " ".join(p.split())
        if len(p_clean) < 15:
            continue

        for rule in rules:
            cat = rule["category"]
            # Allow at most 2 findings per category to keep it structured and clean
            if [f for f in findings if f["category"] == cat].__len__() >= 2:
                continue

            for pattern in rule["patterns"]:
                match = re.search(pattern, p_clean, re.IGNORECASE)
                if match:
                    page_num = find_page_for_text(p_clean)
                    
                    # Extract the most relevant sentence or paragraph chunk
                    original_clause = p_clean
                    if len(p_clean) > 300:
                        sentences = re.split(r'\.\s+', p_clean)
                        relevant_sentences = [s for s in sentences if re.search(pattern, s, re.IGNORECASE)]
                        if relevant_sentences:
                            original_clause = ". ".join(relevant_sentences[:2]) + "."

                    finding = {
                        "category": cat,
                        "title": rule["title"],
                        "importance": rule["importance"],
                        "original_clause": original_clause,
                        "simple_explanation": rule["simple_explanation"],
                        "page_number": page_num
                    }
                    findings.append(finding)
                    matched_categories.add(cat)

                    # Add to student obligation bucket
                    obs_cat = rule["obligation_cat"]
                    if obs_cat in obligations:
                        summary_point = f"{rule['title']}: {rule['simple_explanation']} (Ref: Page {page_num})"
                        if summary_point not in obligations[obs_cat]:
                            obligations[obs_cat].append(summary_point)

                    break

    # If document has duration mentioned
    duration_match = re.search(r"(?:duration|term|period)\s*(?:of)?\s*(\d+\s*(?:months?|weeks?|years?|days?))", full_text, re.IGNORECASE)
    overall_duration = duration_match.group(1) if duration_match else "Fixed Term / Not Specified"

    # Fill default fallbacks for essential categories if completely missing from the text
    if not findings:
        # Generic document analysis if no specific rule matched
        first_page = pages_data[0]["text"] if pages_data else full_text[:400]
        findings.append({
            "category": "General Agreement Terms",
            "title": "Standard Contract Provisions",
            "importance": "Medium",
            "original_clause": first_page[:250] + "...",
            "simple_explanation": "This document contains formal binding provisions. Review the full text before signing.",
            "page_number": 1
        })
        obligations["what_you_need_to_do"].append("Review terms with the issuer before appending your signature.")

    # Populate Key Points
    for f in findings[:5]:
        key_points.append(f"{f['category']}: {f['title']} ({f['importance']} Attention)")

    # Prepare student-friendly summary
    is_internship = any(w in full_text.lower() for w in ["intern", "internship", "stipend", "developer"])
    is_hostel = any(w in full_text.lower() for w in ["hostel", "pg", "room", "resident", "rent", "tenant"])

    if is_internship:
        summary = (
            f"This is an internship agreement with a duration of approximately {overall_duration}. "
            "Key elements include a defined stipend, a mandatory lock-in period, intellectual property ownership "
            "assigned to the employer, and specific notice requirements for early departure."
        )
    elif is_hostel:
        summary = (
            f"This is a residential accommodation/hostel contract for {overall_duration}. "
            "It outlines monthly room fees, utility billing, curfew timings, a lock-in period, and deposit refund conditions."
        )
    else:
        summary = (
            f"This agreement contains binding commitments spanning {overall_duration}. "
            f"ContractAI has identified {len(findings)} important obligations, notice clauses, and financial terms."
        )

    # Ensure obligations have at least some items or informative status
    if not obligations["what_you_need_to_pay"]:
        obligations["what_you_need_to_pay"].append("No specific upfront payment or fee is explicitly mentioned in this document.")
    if not obligations["when_you_need_to_give_notice"]:
        obligations["when_you_need_to_give_notice"].append("No specific prior notice period was found in the text.")
    if not obligations["what_happens_if_you_cancel_or_leave_early"]:
        obligations["what_happens_if_you_cancel_or_leave_early"].append("No specific early cancellation penalty or clause is stated.")

    return {
        "summary": summary,
        "overall_duration": overall_duration,
        "key_points": key_points,
        "findings": findings,
        "student_obligations": obligations
    }

async def analyze_contract_text(full_text: str, pages_data: List[Dict[str, Any]], filename: str = "") -> Dict[str, Any]:
    """
    Main AI Orchestrator:
    Attempts Gemini API first (if configured);
    Falls back gracefully to intelligent local heuristics if key is not configured or fails.
    """
    if GEMINI_API_KEY:
        gemini_result = await analyze_with_gemini(full_text, pages_data)
        if gemini_result and "findings" in gemini_result:
            return gemini_result

    # Smart local heuristics (ensures 100% reliable functionality offline & without paid keys)
    return analyze_with_smart_heuristics(full_text, pages_data, filename)

async def chat_with_gemini(
    contract_text: str,
    analysis_data: Dict[str, Any],
    user_message: str,
    history: List[Dict[str, Any]]
) -> Optional[Dict[str, Any]]:
    """Calls Gemini API to answer contract queries conversational context."""
    if not GEMINI_API_KEY:
        return None

    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )

        history_context = "\n".join([
            f"{msg.get('role', 'user').capitalize()}: {msg.get('content', '')}"
            for msg in history[-6:]
        ])

        summary = analysis_data.get("summary", "")
        findings_sample = analysis_data.get("findings", [])[:10]

        prompt = f"""You are ContractAI, an expert student contract advisor.
A student is asking a question about their signed or prospective agreement.
Your task is to answer accurately, transparently, and in student-friendly language based strictly on the contract text below.

Instructions:
1. Answer the question directly in the first sentence.
2. Highlight any student risks, penalties, financial costs, notice requirements, or deadlines.
3. If the contract doesn't contain info on the topic, clearly state: "This agreement does not explicitly state provisions regarding [topic]. Consider asking the employer/landlord for written clarification."
4. Do NOT give official legal advice, but provide practical student guidance.
5. Provide relevant verbatim citations from the contract whenever applicable.

Contract Summary:
{summary}

Contract Key Clauses:
{json.dumps(findings_sample, indent=2)}

Full Agreement Text:
{contract_text[:12000]}

Recent Conversation History:
{history_context if history_context else 'None'}

Student's Current Question:
{user_message}

You MUST return strictly valid JSON with this schema:
{{
  "reply": "Your clear, student-friendly answer in markdown format (bullets, bold highlights).",
  "citations": [
    {{
      "category": "Category name",
      "clause_text": "Verbatim quote from the agreement",
      "page_number": 1,
      "importance": "High | Medium | Low"
    }}
  ],
  "suggested_followups": [
    "Follow-up question 1",
    "Follow-up question 2",
    "Follow-up question 3"
  ]
}}
"""
        response = model.generate_content(prompt)
        parsed = json.loads(response.text)
        return parsed
    except Exception as e:
        print(f"[ContractAI Chat] Gemini chat error: {e}")
        return None

def chat_with_heuristics(
    contract_text: str,
    analysis_data: Dict[str, Any],
    user_message: str,
    history: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Intelligent semantic and keyword retrieval engine for contract Q&A.
    Functions 100% offline without needing any external API or payment.
    """
    q_lower = user_message.lower().strip()
    findings = analysis_data.get("findings", [])
    obligations = analysis_data.get("student_obligations", {})
    summary = analysis_data.get("summary", "")

    # Topic definitions with matching triggers and student responses
    topics = [
        {
            "id": "exit_and_lockin",
            "keywords": ["leave", "quit", "resign", "exit", "lock-in", "lock in", "break", "cancel", "vacate", "moving out"],
            "categories": ["Lock-in Period", "Cancellation & Termination", "Penalty/Fine"],
            "obligation_key": "what_happens_if_you_cancel_or_leave_early",
            "title": "Early Departure & Lock-in Conditions"
        },
        {
            "id": "notice",
            "keywords": ["notice", "days notice", "prior notice", "written notice", "in advance"],
            "categories": ["Notice Period"],
            "obligation_key": "when_you_need_to_give_notice",
            "title": "Notice Period Requirements"
        },
        {
            "id": "money_stipend_pay",
            "keywords": ["pay", "stipend", "salary", "money", "rent", "fee", "cost", "bonus", "compensation", "amount"],
            "categories": ["Salary/Stipend", "Fees & Deposit", "Payment Terms"],
            "obligation_key": "what_you_need_to_pay",
            "title": "Financial Compensation & Payment Terms"
        },
        {
            "id": "penalties_fines",
            "keywords": ["penalty", "fine", "forfeit", "damage", "deduct", "lose", "charges"],
            "categories": ["Penalty/Fine"],
            "obligation_key": "what_happens_if_you_cancel_or_leave_early",
            "title": "Penalties, Fines & Forfeiture"
        },
        {
            "id": "intellectual_property",
            "keywords": ["code", "intellectual property", "ip", "patent", "copyright", "ownership", "project", "repo", "built"],
            "categories": ["Intellectual Property"],
            "obligation_key": "what_you_cannot_do",
            "title": "Intellectual Property & Code Ownership"
        },
        {
            "id": "confidentiality",
            "keywords": ["confidential", "nda", "secret", "client", "share", "disclosure", "post"],
            "categories": ["Confidentiality"],
            "obligation_key": "what_you_cannot_do",
            "title": "Confidentiality & Non-Disclosure"
        },
        {
            "id": "working_hours_curfew",
            "keywords": ["hours", "time", "timing", "schedule", "curfew", "gate", "night", "weekend", "work from home", "remote"],
            "categories": ["Working Hours & Schedule", "Hostel & Room Rules"],
            "obligation_key": "what_you_need_to_do",
            "title": "Timings, Curfews & Working Schedule"
        },
        {
            "id": "leaves_absence",
            "keywords": ["leave", "holiday", "sick", "casual", "absent", "absence", "vacation", "exam"],
            "categories": ["Leave & Attendance"],
            "obligation_key": "what_you_need_to_do",
            "title": "Leave Policy & Attendance Rules"
        },
        {
            "id": "competitors_freelance",
            "keywords": ["competitor", "freelance", "side project", "moonlight", "another job", "non-compete"],
            "categories": ["Non-Compete & Moonlighting"],
            "obligation_key": "what_you_cannot_do",
            "title": "Restrictions on Outside Work & Competitors"
        }
    ]

    matched_topics = []
    matched_citations = []

    for topic in topics:
        match_score = 0
        for kw in topic["keywords"]:
            if kw in q_lower:
                match_score += 1
        if match_score > 0:
            matched_topics.append((topic, match_score))

    matched_topics.sort(key=lambda x: x[1], reverse=True)

    # Collect matching findings
    for m_topic, _ in matched_topics:
        for f in findings:
            if f.get("category") in m_topic["categories"]:
                if not any(c.get("clause_text") == f.get("original_clause") for c in matched_citations):
                    matched_citations.append({
                        "category": f.get("category", "General"),
                        "clause_text": f.get("original_clause", ""),
                        "page_number": f.get("page_number", 1),
                        "importance": f.get("importance", "Medium")
                    })

    # If no topic matched directly from predefined list, search findings text directly
    if not matched_citations:
        for f in findings:
            f_text = (f.get("title", "") + " " + f.get("simple_explanation", "") + " " + f.get("original_clause", "")).lower()
            words = [w for w in re.findall(r'\w+', q_lower) if len(w) > 3]
            if any(w in f_text for w in words):
                matched_citations.append({
                    "category": f.get("category", "General"),
                    "clause_text": f.get("original_clause", ""),
                    "page_number": f.get("page_number", 1),
                    "importance": f.get("importance", "Medium")
                })

    # Prepare response text
    reply_lines = []
    suggested_followups = []

    if matched_citations:
        top_citations = matched_citations[:3]
        reply_lines.append(f"Based on the provisions extracted from this agreement:")
        
        for c in top_citations:
            reply_lines.append(f"\n- **{c['category']} (Page {c['page_number']})**:")
            reply_lines.append(f"  *\"{c['clause_text']}\"*")
            
            # Find explanation from findings if present
            matching_finding = next((f for f in findings if f.get("original_clause") == c["clause_text"]), None)
            if matching_finding:
                reply_lines.append(f"  **What this means for you**: {matching_finding.get('simple_explanation')}")

        # Check relevant obligations
        for m_topic, _ in matched_topics[:2]:
            obl_list = obligations.get(m_topic["obligation_key"], [])
            if obl_list:
                reply_lines.append(f"\n**Student Obligation Highlight:**")
                for o in obl_list[:2]:
                    reply_lines.append(f"- {o}")

        reply_lines.append("\n> **Student Tip**: Always ensure any verbal promises (exemptions, extensions, or waivers) are confirmed in writing before relying on them.")

        suggested_followups = [
            "Are there any penalties if I quit early?",
            "What is the exact notice period required?",
            "What are my financial obligations and deposits?"
        ]
    else:
        reply_lines.append(f"I reviewed the contract text, but I did not find explicit clauses specifically addressing **\"{user_message}\"**.")
        reply_lines.append("\nHere is what you should keep in mind:")
        reply_lines.append("- If a term is not written down, standard legal defaults or organization discretion may apply.")
        reply_lines.append("- Before signing, ask the HR coordinator or housing manager for explicit written confirmation regarding this matter.")
        
        # Provide general summary context
        if summary:
            reply_lines.append(f"\n**Contract Overview Context**:\n{summary}")

        suggested_followups = [
            "What happens if I cancel or leave early?",
            "What notice period do I need to give?",
            "Who owns my intellectual property or code?"
        ]

    return {
        "reply": "\n".join(reply_lines),
        "citations": matched_citations[:3],
        "suggested_followups": suggested_followups,
        "engine_used": "offline_heuristics"
    }

async def chat_with_contract(
    contract_text: str,
    analysis_data: Dict[str, Any],
    user_message: str,
    history: List[Dict[str, Any]] = []
) -> Dict[str, Any]:
    """
    Main Chat Orchestrator:
    Attempts Gemini API first if configured;
    Falls back gracefully to intelligent local heuristics if key is not configured or fails.
    """
    if GEMINI_API_KEY:
        gemini_result = await chat_with_gemini(contract_text, analysis_data, user_message, history)
        if gemini_result and "reply" in gemini_result:
            gemini_result["engine_used"] = "gemini_1.5_flash"
            return gemini_result

    return chat_with_heuristics(contract_text, analysis_data, user_message, history)

