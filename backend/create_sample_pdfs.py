import os
import pymupdf as fitz
from app.services.ai_service import SAMPLE_INTERNSHIP_AGREEMENT, SAMPLE_HOSTEL_AGREEMENT

os.makedirs(r"d:\final_project_demo\sample_agreements", exist_ok=True)

def create_pdf(text, filepath, title):
    doc = fitz.open()
    page = doc.new_page(width=595, height=842) # A4 size
    rect = fitz.Rect(50, 50, 545, 792)
    page.insert_textbox(rect, text, fontsize=9.5, fontname="helv", lineheight=1.3)
    doc.save(filepath)
    doc.close()
    print(f"Created sample PDF: {filepath}")

create_pdf(
    SAMPLE_INTERNSHIP_AGREEMENT.strip(),
    r"d:\final_project_demo\sample_agreements\Sample_Software_Internship_Agreement.pdf",
    "Sample Internship Agreement"
)

create_pdf(
    SAMPLE_HOSTEL_AGREEMENT.strip(),
    r"d:\final_project_demo\sample_agreements\Sample_Student_Hostel_PG_Agreement.pdf",
    "Sample Hostel Agreement"
)
