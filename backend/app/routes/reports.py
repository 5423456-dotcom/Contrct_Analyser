from bson import ObjectId
from fastapi import APIRouter, HTTPException, Response, status
from app.database.mongodb import get_database
from app.services.report_service import generate_pdf_report
from app.routes.analysis import in_memory_analyses

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/{analysis_id}/pdf")
async def download_analysis_pdf(analysis_id: str):
    db = get_database()
    analysis_data = None

    if db is not None:
        try:
            doc = await db["analyses"].find_one({"_id": ObjectId(analysis_id)})
            if doc:
                analysis_data = doc
        except Exception:
            pass

    if not analysis_data and analysis_id in in_memory_analyses:
        analysis_data = in_memory_analyses[analysis_id]

    if not analysis_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis data not found to generate PDF report."
        )

    try:
        pdf_stream = generate_pdf_report(analysis_data)
        filename = analysis_data.get("filename", "Agreement").replace(".pdf", "")
        clean_download_name = f"ContractAI_Report_{filename}.pdf"

        return Response(
            content=pdf_stream.getvalue(),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{clean_download_name}"',
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        print(f"[ContractAI] Report generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate the PDF report. Please try again."
        )
