from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PageContent(BaseModel):
    page_number: int
    text: str

class ContractUploadText(BaseModel):
    filename: Optional[str] = "Pasted_Agreement.txt"
    text: str

class ContractResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    filename: str
    page_count: int
    extracted_preview: str
    uploaded_at: datetime
