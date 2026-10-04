from datetime import datetime
from typing import Optional
from bson import ObjectId
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from app.database.mongodb import get_database
from app.services.pdf_service import validate_pdf_file, extract_text_from_pdf
from app.services.ai_service import get_sample_agreement
from app.schemas.contract import ContractResponse, ContractUploadText
from app.utils.security import get_current_user_optional

router = APIRouter(prefix="/api/contracts", tags=["Contracts"])

# In-memory storage fallback
in_memory_contracts = {}

@router.post("/upload", response_model=ContractResponse)
async def upload_contract_pdf(
    file: UploadFile = File(...),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    contents = await file.read()
    validate_pdf_file(file, contents)
    
    pages_data, page_count = extract_text_from_pdf(contents)
    full_text = "\n\n".join([f"--- Page {p['page_number']} ---\n" + p['text'] for p in pages_data])

    user_id = current_user["id"] if current_user else None
    filename = file.filename or "Uploaded_Agreement.pdf"

    contract_doc = {
        "user_id": user_id,
        "filename": filename,
        "page_count": page_count,
        "pages_data": pages_data,
        "extracted_text": full_text,
        "uploaded_at": datetime.utcnow()
    }

    db = get_database()
    if db is not None:
        res = await db["contracts"].insert_one(contract_doc)
        contract_id = str(res.inserted_id)
    else:
        contract_id = f"mem_contract_{len(in_memory_contracts) + 1}"
        contract_doc["_id"] = contract_id
        in_memory_contracts[contract_id] = contract_doc

    return {
        "id": contract_id,
        "user_id": user_id,
        "filename": filename,
        "page_count": page_count,
        "extracted_preview": full_text[:400] + ("..." if len(full_text) > 400 else ""),
        "uploaded_at": contract_doc["uploaded_at"]
    }

@router.post("/upload-text", response_model=ContractResponse)
async def upload_contract_text(
    payload: ContractUploadText,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    clean_text = payload.text.strip()
    if len(clean_text) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The agreement text is too short to analyze. Please paste at least a paragraph."
        )

    user_id = current_user["id"] if current_user else None
    filename = payload.filename or "Pasted_Agreement.txt"

    pages_data = [{"page_number": 1, "text": clean_text}]
    page_count = 1

    contract_doc = {
        "user_id": user_id,
        "filename": filename,
        "page_count": page_count,
        "pages_data": pages_data,
        "extracted_text": clean_text,
        "uploaded_at": datetime.utcnow()
    }

    db = get_database()
    if db is not None:
        res = await db["contracts"].insert_one(contract_doc)
        contract_id = str(res.inserted_id)
    else:
        contract_id = f"mem_contract_{len(in_memory_contracts) + 1}"
        contract_doc["_id"] = contract_id
        in_memory_contracts[contract_id] = contract_doc

    return {
        "id": contract_id,
        "user_id": user_id,
        "filename": filename,
        "page_count": page_count,
        "extracted_preview": clean_text[:400] + ("..." if len(clean_text) > 400 else ""),
        "uploaded_at": contract_doc["uploaded_at"]
    }

@router.get("/sample/{sample_type}")
async def get_sample_contract(sample_type: str = "internship"):
    return get_sample_agreement(sample_type)

@router.get("/{contract_id}")
async def get_contract(contract_id: str):
    db = get_database()
    if db is not None:
        try:
            doc = await db["contracts"].find_one({"_id": ObjectId(contract_id)})
            if doc:
                return {
                    "id": str(doc["_id"]),
                    "filename": doc["filename"],
                    "page_count": doc.get("page_count", 1),
                    "extracted_text": doc.get("extracted_text", ""),
                    "uploaded_at": doc.get("uploaded_at")
                }
        except Exception:
            pass

    if contract_id in in_memory_contracts:
        doc = in_memory_contracts[contract_id]
        return {
            "id": contract_id,
            "filename": doc["filename"],
            "page_count": doc.get("page_count", 1),
            "extracted_text": doc.get("extracted_text", ""),
            "uploaded_at": doc.get("uploaded_at")
        }

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found.")
