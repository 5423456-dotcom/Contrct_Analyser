from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class AnalysisModel(BaseModel):
    id: Optional[str] = None
    contract_id: str
    user_id: Optional[str] = None
    filename: str
    summary: str
    overall_duration: Optional[str] = None
    key_points: List[str] = []
    findings: List[Dict[str, Any]] = []
    student_obligations: Dict[str, List[str]] = {}
    page_count: int = 1
    created_at: datetime = datetime.utcnow()
