from datetime import datetime, timedelta
from app.database.mongodb import get_database
from app.utils.security import get_password_hash
from app.routes.auth import in_memory_users
from app.routes.contacts import in_memory_contacts_db, get_demo_contacts_dataset, format_contact_doc
from app.routes.analysis import in_memory_analyses

DEMO_USER_EMAIL = "student@university.edu"
DEMO_USER_NAME = "Alex Sharma"
DEMO_USER_PASSWORD = "student123"

DEMO_ANALYSIS_1 = {
    "filename": "TechCorp_Internship_Agreement.pdf",
    "summary": "This internship agreement binds you to TechCorp for 6 months at INR 25,000/month. Key risks include a 30-day mandatory notice period, full IP assignment for all work created, a 6-month non-compete after leaving, and liquidated damages of INR 15,000 for early exit without notice. Review carefully before signing.",
    "overall_duration": "6 Months",
    "key_points": [
        "30-day written notice required before resignation",
        "Stipend: INR 25,000/month paid by 7th of following month",
        "All work created is owned by TechCorp (IP Assignment)",
        "6-month non-compete restriction post-internship",
        "INR 15,000 liquidated damages if leaving without required notice"
    ],
    "findings": [
        {
            "category": "Notice Period",
            "importance": "High",
            "title": "Mandatory 30-Day Written Notice",
            "original_clause": "Following the lock-in period, either party may terminate this agreement by providing thirty (30) days prior written notice to the designated HR manager.",
            "simple_explanation": "You must give 30 days written notice before leaving. Quitting without notice forfeits unpaid stipend and incurs liquidated damages.",
            "page_number": 1
        },
        {
            "category": "Salary/Stipend",
            "importance": "High",
            "title": "Stipend: INR 25,000/Month",
            "original_clause": "The Company agrees to pay the Intern a monthly gross stipend of INR 25,000 payable on or before the 7th working day of the following month.",
            "simple_explanation": "You get INR 25,000 per month, paid on or before the 7th of the following month.",
            "page_number": 1
        },
        {
            "category": "Intellectual Property",
            "importance": "High",
            "title": "IP Assignment — All Work Belongs to Company",
            "original_clause": "All source code, designs, algorithms, technical documentation, and patentable work created by the Intern during the internship shall remain the exclusive intellectual property of NexaTech Innovations.",
            "simple_explanation": "Everything you write, design, or invent during this internship belongs to the company, not you.",
            "page_number": 2
        },
        {
            "category": "Lock-in Period",
            "importance": "High",
            "title": "3-Month Mandatory Lock-in Period",
            "original_clause": "The Intern agrees to a mandatory lock-in period of three (3) months from the commencement date, during which resignation is strictly not permitted except under documented medical emergencies.",
            "simple_explanation": "You cannot resign during the first 3 months unless you have a documented medical emergency.",
            "page_number": 1
        },
        {
            "category": "Penalty/Fine",
            "importance": "High",
            "title": "Liquidated Damages: INR 15,000 for Early Departure",
            "original_clause": "The Intern shall forfeit unpaid stipend and be liable to pay liquidated damages of INR 15,000 to cover recruitment and training costs.",
            "simple_explanation": "If you leave without 30 days notice, you lose that month's stipend and must pay INR 15,000.",
            "page_number": 2
        }
    ],
    "student_obligations": {
        "what_you_need_to_pay": ["Refundable security deposit of INR 5,000 from first month's stipend"],
        "what_you_need_to_do": ["Work 9:30 AM to 6:30 PM, Mon-Fri (40 hrs/week)", "Provide 30 days written notice after lock-in period", "Submit College ID and Bonafide Certificate within 5 days"],
        "what_you_cannot_do": ["Cannot work for direct competitor for 6 months after leaving", "Cannot disclose confidential client data or codebase for 2 years", "Cannot quit during initial 3-month lock-in"],
        "when_you_need_to_give_notice": ["30 days written notice to designated HR manager after 3-month lock-in"],
        "what_happens_if_you_cancel_or_leave_early": ["Forfeit unpaid stipend for that month", "Liable for INR 15,000 liquidated damages"],
        "important_deadlines": ["Stipend paid on or before 7th working day", "NOC documents within 5 days of joining"]
    },
    "page_count": 2
}

DEMO_ANALYSIS_2 = {
    "filename": "GreenField_Hostel_Agreement.pdf",
    "summary": "Standard student hostel and residential accommodation agreement for an 11-month session. Requires monthly rent of INR 12,000 due by the 5th, with a 4-month lock-in period and an interest-free security deposit of INR 24,000. Leaving without notice causes full deposit forfeiture.",
    "overall_duration": "11 Months",
    "key_points": [
        "Monthly Rent: INR 12,000 due on or before 5th of each month",
        "Mandatory 4-month lock-in period with full deposit forfeiture on early exit",
        "Security Deposit: INR 24,000 (two months' rent)",
        "Late fee: INR 100 per day after the 5th of each month",
        "Notice Period: 30 days written notice to vacate room"
    ],
    "findings": [
        {
            "category": "Payment",
            "importance": "High",
            "title": "Monthly Hostel Rent: INR 12,000",
            "original_clause": "Monthly rent is INR 12,000 per month, which includes electricity up to 100 units, high-speed Wi-Fi, and water. Additional units are charged at INR 10 per unit.",
            "simple_explanation": "Rent is INR 12,000/month, due by the 5th. 100 electricity units included.",
            "page_number": 1
        },
        {
            "category": "Lock-in Period",
            "importance": "High",
            "title": "Mandatory 4-Month Lock-in",
            "original_clause": "The initial four (4) months shall be treated as a mandatory lock-in period. If the resident vacates during this lock-in, the entire security deposit will be forfeited.",
            "simple_explanation": "If you leave within the first 4 months, you lose the entire INR 24,000 security deposit.",
            "page_number": 1
        },
        {
            "category": "Penalty/Fine",
            "importance": "Medium",
            "title": "Late Payment Fine: INR 100/Day",
            "original_clause": "The monthly rent must be paid on or before the 5th day of each calendar month. A late payment fine of INR 100 per day applies from the 6th of the month onwards.",
            "simple_explanation": "Pay by the 5th to avoid a INR 100/day late penalty.",
            "page_number": 1
        },
        {
            "category": "Notice Period",
            "importance": "High",
            "title": "30 Days Notice to Vacate",
            "original_clause": "Residents must provide thirty (30) days prior written notice before vacating the room at the end of the academic session.",
            "simple_explanation": "You must inform the warden 30 days ahead in writing to get your deposit refunded.",
            "page_number": 2
        }
    ],
    "student_obligations": {
        "what_you_need_to_pay": ["Monthly rent: INR 12,000 by 5th", "Security deposit: INR 24,000 upfront", "INR 10/unit for electricity above 100 units"],
        "what_you_need_to_do": ["Pay rent on or before 5th of each month", "Provide 30 days notice to vacate"],
        "what_you_cannot_do": ["Cannot sublet room", "Cannot vacate during 4-month lock-in without losing deposit"],
        "when_you_need_to_give_notice": ["30 days prior written notice before vacating"],
        "what_happens_if_you_cancel_or_leave_early": ["Forfeiture of entire INR 24,000 deposit if vacating during lock-in"],
        "important_deadlines": ["Rent due on 5th of each month", "Late fines start on 6th"]
    },
    "page_count": 2
}

async def seed_initial_data():
    """
    Seeds demo student account, default contacts, and pre-computed contract analyses
    both into MongoDB (if online) and in-memory stores (always).
    """
    db = get_database()
    now = datetime.utcnow()
    hashed_password = get_password_hash(DEMO_USER_PASSWORD)

    # 1. Seed Demo User in Memory
    in_memory_users[DEMO_USER_EMAIL] = {
        "id": "usr_demo_student",
        "name": DEMO_USER_NAME,
        "email": DEMO_USER_EMAIL,
        "password_hash": hashed_password,
        "created_at": now
    }

    demo_user_id = "usr_demo_student"

    # 1b. Seed Demo User in MongoDB
    if db is not None:
        try:
            existing = await db["users"].find_one({"email": DEMO_USER_EMAIL})
            if not existing:
                res = await db["users"].insert_one({
                    "name": DEMO_USER_NAME,
                    "email": DEMO_USER_EMAIL,
                    "password_hash": hashed_password,
                    "created_at": now
                })
                demo_user_id = str(res.inserted_id)
                print(f"[ContractAI Seed] Created demo user '{DEMO_USER_EMAIL}' in MongoDB (ID: {demo_user_id})")
            else:
                demo_user_id = str(existing["_id"])
        except Exception as e:
            print(f"[ContractAI Seed Warning] Could not seed user in MongoDB: {e}")

    # 2. Seed Demo Contacts
    demo_contacts = get_demo_contacts_dataset()
    for idx, c in enumerate(demo_contacts):
        mem_id = f"cnt_demo_{idx + 1}"
        doc = {**c, "id": mem_id, "_id": mem_id, "user_id": demo_user_id, "created_at": now, "updated_at": now}
        in_memory_contacts_db[mem_id] = doc

    if db is not None:
        try:
            count = await db["contacts"].count_documents({"user_id": demo_user_id})
            if count == 0:
                docs_to_insert = [
                    {**c, "user_id": demo_user_id, "created_at": now, "updated_at": now}
                    for c in demo_contacts
                ]
                await db["contacts"].insert_many(docs_to_insert)
                print(f"[ContractAI Seed] Seeded {len(docs_to_insert)} student contacts in MongoDB")
        except Exception as e:
            print(f"[ContractAI Seed Warning] Could not seed contacts in MongoDB: {e}")

    # 3. Seed Demo Analyses in Memory
    mem_analysis_1 = {
        **DEMO_ANALYSIS_1,
        "id": "demo_analysis_1",
        "_id": "demo_analysis_1",
        "contract_id": "demo_contract_1",
        "user_id": demo_user_id,
        "created_at": now - timedelta(days=2)
    }
    mem_analysis_2 = {
        **DEMO_ANALYSIS_2,
        "id": "demo_analysis_2",
        "_id": "demo_analysis_2",
        "contract_id": "demo_contract_2",
        "user_id": demo_user_id,
        "created_at": now - timedelta(days=7)
    }
    in_memory_analyses["demo_analysis_1"] = mem_analysis_1
    in_memory_analyses["demo_analysis_2"] = mem_analysis_2

    if db is not None:
        try:
            count = await db["analyses"].count_documents({"user_id": demo_user_id})
            if count == 0:
                await db["analyses"].insert_many([
                    {
                        **DEMO_ANALYSIS_1,
                        "contract_id": "demo_contract_1",
                        "user_id": demo_user_id,
                        "created_at": now - timedelta(days=2)
                    },
                    {
                        **DEMO_ANALYSIS_2,
                        "contract_id": "demo_contract_2",
                        "user_id": demo_user_id,
                        "created_at": now - timedelta(days=7)
                    }
                ])
                print("[ContractAI Seed] Seeded demo contract analyses in MongoDB")
        except Exception as e:
            print(f"[ContractAI Seed Warning] Could not seed analyses in MongoDB: {e}")
