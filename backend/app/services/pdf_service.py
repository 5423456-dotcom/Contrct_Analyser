import io
from typing import List, Dict, Tuple
import pymupdf as fitz
from fastapi import HTTPException, UploadFile, status

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def validate_pdf_file(file: UploadFile, contents: bytes):
    # Check extension
    filename = file.filename or "unknown.pdf"
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a valid PDF file."
        )

    # Check file size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 10 MB limit."
        )

    # Check magic header for PDF
    if not contents.startswith(b"%PDF"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a valid PDF file."
        )

def extract_text_from_pdf(contents: bytes) -> Tuple[List[Dict[str, any]], int]:
    """
    Extracts text from PDF bytes using PyMuPDF (fitz).
    Returns a tuple of (pages_data, total_pages)
    where pages_data is [{'page_number': 1, 'text': '...'}, ...]
    """
    try:
        doc = fitz.open(stream=contents, filetype="pdf")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to read the PDF document. The file might be corrupted."
        )

    total_pages = len(doc)
    if total_pages == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded PDF contains no pages."
        )

    pages_data = []
    total_text_length = 0

    for idx, page in enumerate(doc):
        page_num = idx + 1
        page_text = page.get_text("text").strip()
        total_text_length += len(page_text)
        pages_data.append({
            "page_number": page_num,
            "text": page_text
        })

    # Check if scanned or image-based
    if total_text_length < 20:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="This PDF may be scanned or image-based. Text extraction was not possible."
        )

    return pages_data, total_pages
