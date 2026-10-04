from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class ContractModel(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    filename: str
    page_count: int
    pages_data: List[Dict[str, Any]] = []
    extracted_text: str
    uploaded_at: datetime = datetime.utcnow()
