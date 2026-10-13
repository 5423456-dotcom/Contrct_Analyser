import csv
import io
from datetime import datetime, timedelta
from typing import List, Optional
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, Query, Response, status
from app.database.mongodb import get_database
from app.schemas.contact import (
    ContactCreate,
    ContactUpdate,
    ContactResponse,
    ContactAnalyticsResponse,
    CsvImportPayload,
    CsvImportResponse
)
from app.utils.security import get_current_user_optional

router = APIRouter(prefix="/api/contacts", tags=["Contacts"])

# In-memory storage fallback
in_memory_contacts_db = {}

def get_demo_contacts_dataset() -> List[dict]:
    today = datetime.utcnow().date()
    return [
        # TEACHERS
        {
            "name": "Dr. Ramesh Kulkarni",
            "email": "kulkarni.cs@university.edu",
            "phone": "+91 98201 12345",
            "category": "Teachers",
            "tags": ["Project Guide", "Recommendation Letter", "High Priority"],
            "last_interaction": (today - timedelta(days=42)).isoformat(),
            "interaction_frequency": "Monthly",
            "priority": "High",
            "notes": "Thesis supervisor. Follow up for final semester internship NOC and recommendation letter."
        },
        {
            "name": "Prof. Anita Joshi",
            "email": "anita.joshi@university.edu",
            "phone": "+91 98330 44556",
            "category": "Teachers",
            "tags": ["Examiner", "Elective Guide", "ML Project"],
            "last_interaction": (today - timedelta(days=18)).isoformat(),
            "interaction_frequency": "Monthly",
            "priority": "Medium",
            "notes": "ML elective project mentor. Exam scheduled in 3 weeks."
        },
        {
            "name": "Dr. Suresh Menon (HoD)",
            "email": "suresh.menon@university.edu",
            "phone": "+91 97110 23456",
            "category": "Teachers",
            "tags": ["HoD", "Clearance", "Graduation NOC"],
            "last_interaction": (today - timedelta(days=60)).isoformat(),
            "interaction_frequency": "Rarely",
            "priority": "High",
            "notes": "Head of Department. Need clearance form signed before graduation."
        },
        # COLLEGE
        {
            "name": "Student Affairs Office",
            "email": "studentaffairs@university.edu",
            "phone": "+91 20 2233 4455",
            "category": "College",
            "tags": ["Bonafide", "Scholarship", "NOC"],
            "last_interaction": (today - timedelta(days=30)).isoformat(),
            "interaction_frequency": "Monthly",
            "priority": "Medium",
            "notes": "Contact for bonafide certificate and scholarship documents."
        },
        {
            "name": "Training & Placement Cell",
            "email": "tnp@university.edu",
            "phone": "+91 20 2233 5566",
            "category": "College",
            "tags": ["Placement", "On-Campus", "Resume Submission"],
            "last_interaction": (today - timedelta(days=7)).isoformat(),
            "interaction_frequency": "Weekly",
            "priority": "High",
            "notes": "Coordinates campus placement drives. Resume submission deadline Nov 15."
        },
        {
            "name": "Library (No-Due Clearance)",
            "email": "library@university.edu",
            "phone": "",
            "category": "College",
            "tags": ["Books", "No Due Certificate"],
            "last_interaction": (today - timedelta(days=90)).isoformat(),
            "interaction_frequency": "Rarely",
            "priority": "Low",
            "notes": "No due clearance needed before semester end. 1 overdue book."
        },
        # FRIENDS
        {
            "name": "Ananya Deshmukh",
            "email": "ananya.d@gmail.com",
            "phone": "+91 91234 56780",
            "category": "Friends",
            "tags": ["Hackathon Teammate", "Study Group", "Frontend Dev"],
            "last_interaction": (today - timedelta(days=1)).isoformat(),
            "interaction_frequency": "Daily",
            "priority": "Medium",
            "notes": "Lead frontend developer for hackathon project."
        },
        {
            "name": "Rohan Mehta",
            "email": "rohan.m@gmail.com",
            "phone": "+91 92345 67891",
            "category": "Friends",
            "tags": ["Study Partner", "Backend Dev", "Weekly Meeting"],
            "last_interaction": (today - timedelta(days=2)).isoformat(),
            "interaction_frequency": "Daily",
            "priority": "Low",
            "notes": "Backend partner for mini project. Study group every Sunday 10AM."
        },
        {
            "name": "Preethi Kumar",
            "email": "preethi.k@gmail.com",
            "phone": "+91 93456 78902",
            "category": "Friends",
            "tags": ["Design", "UI/UX", "PPT Help"],
            "last_interaction": (today - timedelta(days=5)).isoformat(),
            "interaction_frequency": "Weekly",
            "priority": "Low",
            "notes": "Helps with design and presentations. Available on weekends."
        },
        {
            "name": "Kabir Sethi",
            "email": "kabir.s@gmail.com",
            "phone": "+91 94321 09876",
            "category": "Friends",
            "tags": ["Notes Sharing", "Same Branch", "Attendance Buddy"],
            "last_interaction": (today - timedelta(days=1)).isoformat(),
            "interaction_frequency": "Daily",
            "priority": "Low",
            "notes": "Same branch friend. Shares notes and assignment solutions."
        },
        # INTERNSHIP
        {
            "name": "Vikram Mehta (Tech Mentor)",
            "email": "vikram.m@innovatelabs.io",
            "phone": "+91 97110 88990",
            "category": "Internship",
            "tags": ["Tech Mentor", "Code Review", "Sprint Review"],
            "last_interaction": (today - timedelta(days=2)).isoformat(),
            "interaction_frequency": "Daily",
            "priority": "High",
            "notes": "Senior Engineering Mentor. Weekly 1-on-1 every Tuesday."
        },
        {
            "name": "Priya Sharma (HR)",
            "email": "priya.sharma@techcorp.in",
            "phone": "+91 98450 54321",
            "category": "Internship",
            "tags": ["Stipend", "Offer Letter", "Onboarding", "HR"],
            "last_interaction": (today - timedelta(days=4)).isoformat(),
            "interaction_frequency": "Weekly",
            "priority": "High",
            "notes": "HR Manager at TechCorp. Stipend INR 15000/month. Review notice period clause."
        },
        {
            "name": "Kiran Nair (Manager)",
            "email": "kiran.nair@techcorp.in",
            "phone": "",
            "category": "Internship",
            "tags": ["Manager", "Project Lead", "Missing Phone"],
            "last_interaction": (today - timedelta(days=8)).isoformat(),
            "interaction_frequency": "Weekly",
            "priority": "High",
            "notes": "Direct reporting manager. Weekly status report due every Friday."
        },
        # PLACEMENT
        {
            "name": "Arjun Rao (TalentBridge)",
            "email": "arjun.rao@talentbridge.co",
            "phone": "+91 97634 12309",
            "category": "Placement",
            "tags": ["Campus Recruiter", "Technical Round 2"],
            "last_interaction": (today - timedelta(days=15)).isoformat(),
            "interaction_frequency": "Bi-weekly",
            "priority": "Medium",
            "notes": "Campus recruiter. Technical assessment round 2 scheduled."
        },
        {
            "name": "Sneha Patel (Microsoft)",
            "email": "sneha.patel@alumni.edu",
            "phone": "+91 99880 77665",
            "category": "Placement",
            "tags": ["Alumni Referral", "SWE II", "High Priority"],
            "last_interaction": (today - timedelta(days=50)).isoformat(),
            "interaction_frequency": "Rarely",
            "priority": "High",
            "notes": "Working at Microsoft. Promised employee referral. URGENT: Follow up!"
        },
        {
            "name": "Infosys Campus HR",
            "email": "campus.hr@infosys.com",
            "phone": "+91 80 4116 4116",
            "category": "Placement",
            "tags": ["Mass Recruiter", "Campus Drive", "Service Bond"],
            "last_interaction": (today - timedelta(days=20)).isoformat(),
            "interaction_frequency": "Monthly",
            "priority": "Medium",
            "notes": "Infosys campus drive. 18-month bond clause in offer letter - review before signing."
        },
        # HACKATHON
        {
            "name": "Devraj Singh (Team Lead)",
            "email": "devraj.s@hackmail.com",
            "phone": "+91 91112 34567",
            "category": "Hackathon",
            "tags": ["Team Lead", "Full Stack", "SIH 2026"],
            "last_interaction": (today - timedelta(days=3)).isoformat(),
            "interaction_frequency": "Daily",
            "priority": "High",
            "notes": "Team leader for Smart India Hackathon 2026. Demo Oct 5."
        },
        {
            "name": "Meera Krishnan (ML)",
            "email": "meera.k@hackmail.com",
            "phone": "+91 94445 67890",
            "category": "Hackathon",
            "tags": ["ML Engineer", "AI Pipeline", "SIH 2026"],
            "last_interaction": (today - timedelta(days=1)).isoformat(),
            "interaction_frequency": "Daily",
            "priority": "High",
            "notes": "ML teammate for hackathon. Check in before 11 PM daily."
        },
        # PROFESSIONAL
        {
            "name": "Suresh Patil (Hostel Warden)",
            "email": "warden.boyshostel@university.edu",
            "phone": "+91 94220 33445",
            "category": "Professional",
            "tags": ["Hostel", "PG Agreement", "Security Deposit"],
            "last_interaction": (today - timedelta(days=65)).isoformat(),
            "interaction_frequency": "Rarely",
            "priority": "Medium",
            "notes": "Hostel warden. Security deposit refund pending. Curfew extension form needed."
        },
        {
            "name": "CA Ravi Deora",
            "email": "ravi.deora@taxfirm.co.in",
            "phone": "+91 98765 01234",
            "category": "Professional",
            "tags": ["Chartered Accountant", "ITR Filing", "Tax"],
            "last_interaction": (today - timedelta(days=120)).isoformat(),
            "interaction_frequency": "Rarely",
            "priority": "Low",
            "notes": "CA for student ITR filing. Next ITR deadline: July 31."
        }
    ]

def format_contact_doc(doc: dict) -> dict:
    return {
        "id": str(doc.get("_id", doc.get("id", ""))),
        "name": doc.get("name", ""),
        "email": doc.get("email", ""),
        "phone": doc.get("phone", ""),
        "category": doc.get("category", "Peer / Student"),
        "tags": doc.get("tags", []),
        "lastInteraction": doc.get("last_interaction") or doc.get("lastInteraction"),
        "interactionFrequency": doc.get("interaction_frequency") or doc.get("interactionFrequency") or "Monthly",
        "priority": doc.get("priority", "Medium"),
        "notes": doc.get("notes", ""),
        "user_id": doc.get("user_id"),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at")
    }

def calculate_analytics(contact_list: List[dict]) -> dict:
    now = datetime.utcnow().date()
    total = len(contact_list)
    active_count = 0
    inactive_count = 0
    high_priority_count = 0
    missing_info_count = 0

    category_map = {}
    frequency_map = {}
    inactive_high_priority = []
    duplicates = []

    email_seen = {}
    phone_seen = {}
    name_seen = {}

    for c in contact_list:
        last_str = c.get("lastInteraction") or c.get("last_interaction")
        days_ago = 999
        if last_str:
            try:
                dt = datetime.fromisoformat(last_str.split("T")[0]).date()
                days_ago = (now - dt).days
            except Exception:
                pass

        freq = c.get("interactionFrequency") or c.get("interaction_frequency") or "Monthly"
        prio = c.get("priority", "Medium")
        cat = c.get("category", "Peer / Student")
        email = (c.get("email") or "").strip().lower()
        phone = (c.get("phone") or "").strip()
        name = (c.get("name") or "").strip().lower()

        is_active = (days_ago <= 30) and (freq != "Rarely")
        if is_active:
            active_count += 1
        else:
            inactive_count += 1

        if prio == "High":
            high_priority_count += 1
            if days_ago > 30:
                inactive_high_priority.append({
                    "contact": c,
                    "daysAgo": days_ago
                })

        if not email or not phone:
            missing_info_count += 1

        category_map[cat] = category_map.get(cat, 0) + 1
        frequency_map[freq] = frequency_map.get(freq, 0) + 1

        # Duplicate detection
        if email:
            if email in email_seen:
                duplicates.append({
                    "reason": "Identical Email",
                    "value": email,
                    "contact1": email_seen[email],
                    "contact2": c
                })
            else:
                email_seen[email] = c

        clean_phone = "".join(filter(str.isdigit, phone))
        if len(clean_phone) >= 8:
            if clean_phone in phone_seen:
                duplicates.append({
                    "reason": "Identical Phone Number",
                    "value": phone,
                    "contact1": phone_seen[clean_phone],
                    "contact2": c
                })
            else:
                phone_seen[clean_phone] = c

        if name:
            if name in name_seen:
                duplicates.append({
                    "reason": "Identical Name",
                    "value": c.get("name"),
                    "contact1": name_seen[name],
                    "contact2": c
                })
            else:
                name_seen[name] = c

    # Deduplicate duplicate alerts
    unique_duplicates = []
    seen_pairs = set()
    for d in duplicates:
        id1 = str(d["contact1"].get("id", ""))
        id2 = str(d["contact2"].get("id", ""))
        pair_key = tuple(sorted([id1, id2]))
        if pair_key not in seen_pairs:
            seen_pairs.add(pair_key)
            unique_duplicates.append(d)

    # Health Score Calculation (0-100)
    health_score = 75
    if total > 0:
        active_ratio = active_count / total
        at_risk_deduction = (len(inactive_high_priority) / (high_priority_count or 1)) * 30
        duplicate_deduction = min(20, len(unique_duplicates) * 10)
        health_score = max(10, min(100, round(active_ratio * 60 + 30 - at_risk_deduction - duplicate_deduction)))

    # AI Actionable Recommendations
    ai_recommendations = []
    if inactive_high_priority:
        first_contact = inactive_high_priority[0]["contact"]
        days = inactive_high_priority[0]["daysAgo"]
        ai_recommendations.append({
            "type": "critical",
            "title": f"{len(inactive_high_priority)} High-Priority Contacts Need Attention",
            "description": f"Key relationships like {first_contact.get('name')} ({first_contact.get('category')}) have not been reached in over {days} days. Reach out soon to maintain connection.",
            "actionText": "Reach Out Now"
        })

    if unique_duplicates:
        ai_recommendations.append({
            "type": "warning",
            "title": f"{len(unique_duplicates)} Potential Duplicate Contact Records Detected",
            "description": f"Clean up duplicate entries (e.g., '{unique_duplicates[0]['contact1'].get('name')}') to prevent conflicting logs and repeated emails.",
            "actionText": "Review Duplicates"
        })

    if category_map.get("Recruiter / HR") and not category_map.get("Internship Mentor"):
        ai_recommendations.append({
            "type": "growth",
            "title": "Expand Engineering & Technical Mentor Network",
            "description": "You have recruiters saved, but no direct engineering mentors. Connecting with alumni mentors boosts your internship interview conversion by 4x.",
            "actionText": "Add Mentor"
        })

    if missing_info_count > 0:
        ai_recommendations.append({
            "type": "info",
            "title": f"{missing_info_count} Contacts Missing Phone or Email Details",
            "description": "Ensure you have alternative communication channels before internship application deadlines and exam NOC clearances.",
            "actionText": "Update Contacts"
        })

    ai_recommendations.append({
        "type": "tip",
        "title": "Optimal Student Networking Cadence",
        "description": "Interact with professors every 3 weeks and recruitment leads once every 10-14 days to keep relationships active.",
        "actionText": "View Schedule"
    })

    return {
        "totalContacts": total,
        "activeCount": active_count,
        "inactiveCount": inactive_count,
        "highPriorityCount": high_priority_count,
        "missingInfoCount": missing_info_count,
        "healthScore": health_score,
        "categoryBreakdown": category_map,
        "frequencyBreakdown": frequency_map,
        "inactiveHighPriority": inactive_high_priority,
        "duplicates": unique_duplicates,
        "aiRecommendations": ai_recommendations
    }

async def fetch_contacts_internal(
    category: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    user_id: Optional[str] = None
) -> List[dict]:
    db = get_database()
    contacts = []

    if db is not None:
        query = {}
        if user_id:
            query["$or"] = [{"user_id": user_id}, {"user_id": None}]

        if category and str(category).lower() != "all":
            query["category"] = category
        if priority and str(priority).lower() != "all":
            query["priority"] = priority

        cursor = db["contacts"].find(query).sort("created_at", -1)
        async for doc in cursor:
            contacts.append(format_contact_doc(doc))
    else:
        for c_id, doc in in_memory_contacts_db.items():
            if user_id and doc.get("user_id") and doc.get("user_id") != user_id:
                continue
            if category and str(category).lower() != "all" and doc.get("category") != category:
                continue
            if priority and str(priority).lower() != "all" and doc.get("priority") != priority:
                continue
            contacts.append(format_contact_doc(doc))

    # Apply search filter if provided
    if search:
        s_lower = str(search).lower()
        contacts = [
            c for c in contacts
            if s_lower in c["name"].lower()
            or s_lower in (c["email"] or "").lower()
            or s_lower in (c["phone"] or "")
            or s_lower in (c["notes"] or "").lower()
            or any(s_lower in t.lower() for t in c.get("tags", []))
        ]

    # Apply status filter if provided
    if status and str(status).lower() != "all":
        today = datetime.utcnow().date()
        filtered = []
        for c in contacts:
            last = c.get("lastInteraction")
            days = 999
            if last:
                try:
                    dt = datetime.fromisoformat(last.split("T")[0]).date()
                    days = (today - dt).days
                except Exception:
                    pass
            is_active = (days <= 30) and (c.get("interactionFrequency") != "Rarely")
            if status == "active" and is_active:
                filtered.append(c)
            elif status == "inactive" and not is_active:
                filtered.append(c)
            elif status == "high-priority" and c.get("priority") == "High":
                filtered.append(c)
        contacts = filtered

    return contacts

@router.get("", response_model=List[ContactResponse])
async def get_contacts(
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    user_id = current_user["id"] if current_user else None
    cat_val = category if isinstance(category, str) else None
    prio_val = priority if isinstance(priority, str) else None
    stat_val = status if isinstance(status, str) else None
    search_val = search if isinstance(search, str) else None
    return await fetch_contacts_internal(cat_val, prio_val, stat_val, search_val, user_id)

@router.get("/analytics", response_model=ContactAnalyticsResponse)
async def get_contact_analytics(
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    user_id = current_user["id"] if current_user else None
    contacts = await fetch_contacts_internal(user_id=user_id)
    analytics = calculate_analytics(contacts)
    return analytics

@router.post("", response_model=ContactResponse)
async def create_contact(
    payload: ContactCreate,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    db = get_database()
    user_id = current_user["id"] if current_user else None
    now = datetime.utcnow()

    doc = {
        "name": payload.name.strip(),
        "email": (payload.email or "").strip(),
        "phone": (payload.phone or "").strip(),
        "category": payload.category or "Peer / Student",
        "tags": payload.tags or [],
        "last_interaction": payload.last_interaction or now.date().isoformat(),
        "interaction_frequency": payload.interaction_frequency or "Monthly",
        "priority": payload.priority or "Medium",
        "notes": (payload.notes or "").strip(),
        "user_id": user_id,
        "created_at": now,
        "updated_at": now
    }

    if db is not None:
        res = await db["contacts"].insert_one(doc)
        doc["_id"] = res.inserted_id
    else:
        mem_id = f"cnt_{len(in_memory_contacts_db) + 1}_{int(now.timestamp())}"
        doc["_id"] = mem_id
        in_memory_contacts_db[mem_id] = doc

    return format_contact_doc(doc)

@router.post("/seed-demo", response_model=List[ContactResponse])
async def seed_demo_contacts(
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    db = get_database()
    user_id = current_user["id"] if current_user else None
    demo_items = get_demo_contacts_dataset()
    now = datetime.utcnow()

    created = []
    if db is not None:
        if user_id:
            await db["contacts"].delete_many({"user_id": user_id})
        else:
            await db["contacts"].delete_many({"user_id": None})

        for item in demo_items:
            doc = {**item, "user_id": user_id, "created_at": now, "updated_at": now}
            res = await db["contacts"].insert_one(doc)
            doc["_id"] = res.inserted_id
            created.append(format_contact_doc(doc))
    else:
        in_memory_contacts_db.clear()
        for idx, item in enumerate(demo_items):
            mem_id = f"cnt_demo_{idx + 1}"
            doc = {**item, "id": mem_id, "_id": mem_id, "user_id": user_id, "created_at": now, "updated_at": now}
            in_memory_contacts_db[mem_id] = doc
            created.append(format_contact_doc(doc))

    return created

@router.post("/import-csv", response_model=CsvImportResponse)
async def import_csv_contacts(
    payload: CsvImportPayload,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    db = get_database()
    user_id = current_user["id"] if current_user else None
    csv_text = payload.csv_text.strip()
    if not csv_text:
        raise HTTPException(status_code=400, detail="CSV content is empty.")

    reader = csv.reader(io.StringIO(csv_text))
    rows = list(reader)
    if len(rows) < 2:
        raise HTTPException(status_code=400, detail="CSV must contain header and at least one row.")

    header = [h.strip().lower() for h in rows[0]]
    def find_idx(keywords):
        for idx, col in enumerate(header):
            if any(k in col for k in keywords):
                return idx
        return -1

    name_idx = find_idx(["name"])
    email_idx = find_idx(["email"])
    phone_idx = find_idx(["phone", "mobile"])
    cat_idx = find_idx(["cat", "role", "type"])
    last_idx = find_idx(["last", "date"])
    freq_idx = find_idx(["freq"])
    prio_idx = find_idx(["priority"])
    notes_idx = find_idx(["note"])

    if name_idx == -1 and email_idx == -1:
        raise HTTPException(status_code=400, detail="CSV must contain a 'Name' or 'Email' column.")

    now = datetime.utcnow()
    added_docs = []

    for row in rows[1:]:
        if not row or not any(cell.strip() for cell in row):
            continue
        name = row[name_idx].strip() if name_idx != -1 and name_idx < len(row) else "Imported Contact"
        email = row[email_idx].strip() if email_idx != -1 and email_idx < len(row) else ""
        phone = row[phone_idx].strip() if phone_idx != -1 and phone_idx < len(row) else ""
        cat = row[cat_idx].strip() if cat_idx != -1 and cat_idx < len(row) and row[cat_idx].strip() else "Peer / Student"
        last = row[last_idx].strip() if last_idx != -1 and last_idx < len(row) and row[last_idx].strip() else now.date().isoformat()
        freq = row[freq_idx].strip() if freq_idx != -1 and freq_idx < len(row) and row[freq_idx].strip() else "Monthly"
        prio = row[prio_idx].strip() if prio_idx != -1 and prio_idx < len(row) and row[prio_idx].strip() else "Medium"
        notes = row[notes_idx].strip() if notes_idx != -1 and notes_idx < len(row) else ""

        doc = {
            "name": name,
            "email": email,
            "phone": phone,
            "category": cat,
            "tags": ["Imported CSV"],
            "last_interaction": last,
            "interaction_frequency": freq,
            "priority": prio,
            "notes": notes,
            "user_id": user_id,
            "created_at": now,
            "updated_at": now
        }
        added_docs.append(doc)

    if not added_docs:
        raise HTTPException(status_code=400, detail="No valid contact rows found in CSV.")

    if db is not None:
        await db["contacts"].insert_many(added_docs)
        total = await db["contacts"].count_documents({"user_id": user_id} if user_id else {})
    else:
        for idx, d in enumerate(added_docs):
            mem_id = f"mem_csv_{len(in_memory_contacts_db) + idx}"
            d["_id"] = mem_id
            in_memory_contacts_db[mem_id] = d
        total = len(in_memory_contacts_db)

    return {"addedCount": len(added_docs), "total": total}

@router.get("/export-csv")
async def export_contacts_csv(
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    user_id = current_user["id"] if current_user else None
    contacts = await fetch_contacts_internal(user_id=user_id)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Email", "Phone", "Category", "Tags", "Last Interaction", "Frequency", "Priority", "Notes"])

    for c in contacts:
        writer.writerow([
            c.get("name", ""),
            c.get("email") or "",
            c.get("phone") or "",
            c.get("category", ""),
            ";".join(c.get("tags") or []),
            c.get("lastInteraction") or c.get("last_interaction") or "",
            c.get("interactionFrequency") or c.get("interaction_frequency") or "",
            c.get("priority", ""),
            c.get("notes") or ""
        ])

    csv_data = output.getvalue()
    filename = f"Student_Contacts_{datetime.utcnow().strftime('%Y-%m-%d')}.csv"
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact_by_id(contact_id: str):
    db = get_database()
    if db is not None:
        try:
            doc = await db["contacts"].find_one({"_id": ObjectId(contact_id)})
            if doc:
                return format_contact_doc(doc)
        except Exception:
            pass

    if contact_id in in_memory_contacts_db:
        return format_contact_doc(in_memory_contacts_db[contact_id])

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found.")

@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(contact_id: str, payload: ContactUpdate):
    db = get_database()
    update_data = {k: v for k, v in payload.model_dump(by_alias=False, exclude_unset=True).items()}
    update_data["updated_at"] = datetime.utcnow()

    # Handle aliases
    if payload.last_interaction is not None:
        update_data["last_interaction"] = payload.last_interaction
    if payload.interaction_frequency is not None:
        update_data["interaction_frequency"] = payload.interaction_frequency

    if db is not None:
        try:
            res = await db["contacts"].find_one_and_update(
                {"_id": ObjectId(contact_id)},
                {"$set": update_data},
                return_document=True
            )
            if res:
                return format_contact_doc(res)
        except Exception:
            pass

    if contact_id in in_memory_contacts_db:
        in_memory_contacts_db[contact_id].update(update_data)
        return format_contact_doc(in_memory_contacts_db[contact_id])

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found.")

@router.delete("/{contact_id}")
async def delete_contact(contact_id: str):
    db = get_database()
    deleted = False

    if db is not None:
        try:
            res = await db["contacts"].delete_one({"_id": ObjectId(contact_id)})
            deleted = res.deleted_count > 0
        except Exception:
            pass

    if not deleted and contact_id in in_memory_contacts_db:
        del in_memory_contacts_db[contact_id]
        deleted = True

    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found or already deleted.")

    return {"message": "Contact deleted successfully", "id": contact_id}
