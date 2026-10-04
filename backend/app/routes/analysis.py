from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, status
from app.database.mongodb import get_database
from app.schemas.analysis import AnalysisResult, AnalysisHistoryItem, ChatRequest, ChatResponse
from app.services.ai_service import analyze_contract_text, chat_with_contract
from app.utils.security import get_current_user_optional
from app.routes.contracts import in_memory_contracts

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])

# In-memory analyses fallback
in_memory_analyses = {}

@router.post("/{contract_id}", response_model=AnalysisResult)
async def analyze_contract(
    contract_id: str,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    db = get_database()
    contract_data = None

    if db is not None:
        try:
            doc = await db["contracts"].find_one({"_id": ObjectId(contract_id)})
            if doc:
                contract_data = doc
        except Exception:
            pass

    if not contract_data and contract_id in in_memory_contracts:
        contract_data = in_memory_contracts[contract_id]

    if not contract_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found. Please upload the contract again."
        )

    full_text = contract_data.get("extracted_text", "")
    pages_data = contract_data.get("pages_data", [{"page_number": 1, "text": full_text}])
    filename = contract_data.get("filename", "Agreement.pdf")
    page_count = contract_data.get("page_count", len(pages_data))
    user_id = current_user["id"] if current_user else contract_data.get("user_id")

    # Run AI Analysis (Gemini / Smart Clause extraction engine)
    ai_output = await analyze_contract_text(full_text, pages_data, filename)

    analysis_doc = {
        "contract_id": contract_id,
        "filename": filename,
        "user_id": user_id,
        "summary": ai_output.get("summary", ""),
        "overall_duration": ai_output.get("overall_duration", "Not specified"),
        "key_points": ai_output.get("key_points", []),
        "findings": ai_output.get("findings", []),
        "student_obligations": ai_output.get("student_obligations", {}),
        "page_count": page_count,
        "created_at": datetime.utcnow()
    }

    if db is not None:
        res = await db["analyses"].insert_one(analysis_doc)
        analysis_id = str(res.inserted_id)
        analysis_doc["id"] = analysis_id
    else:
        analysis_id = f"mem_analysis_{len(in_memory_analyses) + 1}"
        analysis_doc["id"] = analysis_id
        analysis_doc["_id"] = analysis_id
        in_memory_analyses[analysis_id] = analysis_doc

    return analysis_doc

@router.get("/history", response_model=List[AnalysisHistoryItem])
async def get_analysis_history(
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    db = get_database()
    history = []
    user_id = current_user["id"] if current_user else None

    if db is not None:
        query = {"user_id": user_id} if user_id else {}
        cursor = db["analyses"].find(query).sort("created_at", -1).limit(50)
        async for doc in cursor:
            findings = doc.get("findings", [])
            summary = doc.get("summary", "")
            history.append({
                "id": str(doc["_id"]),
                "contract_id": str(doc.get("contract_id", "")),
                "filename": doc.get("filename", "Agreement.pdf"),
                "created_at": doc.get("created_at", datetime.utcnow()),
                "page_count": doc.get("page_count", 1),
                "findings_count": len(findings),
                "summary_preview": summary[:120] + ("..." if len(summary) > 120 else ""),
                "status": "Completed"
            })
    else:
        for aid, doc in sorted(in_memory_analyses.items(), key=lambda x: x[1].get("created_at", datetime.min), reverse=True):
            if user_id and doc.get("user_id") != user_id:
                continue
            findings = doc.get("findings", [])
            summary = doc.get("summary", "")
            history.append({
                "id": aid,
                "contract_id": str(doc.get("contract_id", "")),
                "filename": doc.get("filename", "Agreement.pdf"),
                "created_at": doc.get("created_at", datetime.utcnow()),
                "page_count": doc.get("page_count", 1),
                "findings_count": len(findings),
                "summary_preview": summary[:120] + ("..." if len(summary) > 120 else ""),
                "status": "Completed"
            })

    return history

@router.get("/{analysis_id}", response_model=AnalysisResult)
async def get_analysis_by_id(analysis_id: str):
    db = get_database()
    if db is not None:
        try:
            doc = await db["analyses"].find_one({"_id": ObjectId(analysis_id)})
            if doc:
                doc["id"] = str(doc["_id"])
                return doc
        except Exception:
            pass

    if analysis_id in in_memory_analyses:
        return in_memory_analyses[analysis_id]

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Analysis result not found."
    )

@router.delete("/{analysis_id}")
async def delete_analysis(analysis_id: str):
    db = get_database()
    deleted = False

    if db is not None:
        try:
            res = await db["analyses"].delete_one({"_id": ObjectId(analysis_id)})
            deleted = res.deleted_count > 0
        except Exception:
            pass

    if not deleted and analysis_id in in_memory_analyses:
        del in_memory_analyses[analysis_id]
        deleted = True

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or already deleted."
        )

    return {"message": "Analysis deleted successfully", "id": analysis_id}

@router.post("/{analysis_id}/chat", response_model=ChatResponse)
async def chat_with_analyzed_contract(
    analysis_id: str,
    payload: ChatRequest
):
    """
    Interactive Q&A assistant for a specific analyzed contract.
    Answers student questions grounded in the contract text and findings.
    """
    db = get_database()
    analysis_doc = None

    if db is not None:
        try:
            doc = await db["analyses"].find_one({"_id": ObjectId(analysis_id)})
            if doc:
                analysis_doc = doc
        except Exception:
            pass

    if not analysis_doc and analysis_id in in_memory_analyses:
        analysis_doc = in_memory_analyses[analysis_id]

    if not analysis_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract analysis not found. Please analyze a contract first."
        )

    # Fetch original contract text
    contract_id = analysis_doc.get("contract_id", "")
    contract_text = ""

    if db is not None and contract_id:
        try:
            c_doc = await db["contracts"].find_one({"_id": ObjectId(contract_id)})
            if c_doc:
                contract_text = c_doc.get("extracted_text", "")
        except Exception:
            pass

    if not contract_text and contract_id in in_memory_contracts:
        contract_text = in_memory_contracts[contract_id].get("extracted_text", "")

    # Fallback to reconstructing text from findings if contract record was not persisted
    if not contract_text:
        findings_text = "\n".join([f"{f.get('title', '')}: {f.get('original_clause', '')}" for f in analysis_doc.get("findings", [])])
        contract_text = f"Summary: {analysis_doc.get('summary', '')}\n\nClauses:\n{findings_text}"

    history_dicts = [
        {"role": msg.role, "content": msg.content}
        for msg in (payload.history or [])
    ]

    response = await chat_with_contract(
        contract_text=contract_text,
        analysis_data=analysis_doc,
        user_message=payload.message,
        history=history_dicts
    )

    return response

