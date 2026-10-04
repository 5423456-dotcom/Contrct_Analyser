from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class FindingItem(BaseModel):
    category: str
    title: str
    importance: str = Field(..., description="High, Medium, or Low (attention level for student)")
    original_clause: str
    simple_explanation: str
    page_number: int = 1

class StudentObligations(BaseModel):
    what_you_need_to_pay: List[str] = []
    what_you_need_to_do: List[str] = []
    what_you_cannot_do: List[str] = []
    when_you_need_to_give_notice: List[str] = []
    what_happens_if_you_cancel_or_leave_early: List[str] = []
    important_deadlines: List[str] = []

class AnalysisResult(BaseModel):
    id: Optional[str] = None
    contract_id: str
    filename: str
    user_id: Optional[str] = None
    summary: str
    overall_duration: Optional[str] = "Not specified"
    key_points: List[str] = []
    findings: List[FindingItem] = []
    student_obligations: StudentObligations = StudentObligations()
    page_count: int = 1
    created_at: Optional[datetime] = None

class AnalysisHistoryItem(BaseModel):
    id: str
    contract_id: str
    filename: str
    created_at: datetime
    page_count: int
    findings_count: int
    summary_preview: str
    status: str = "Completed"

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str
    timestamp: Optional[datetime] = None

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: Optional[List[ChatMessage]] = []

class ChatCitation(BaseModel):
    category: str
    clause_text: str
    page_number: int = 1
    importance: str = "Medium"

class ChatResponse(BaseModel):
    reply: str
    citations: List[ChatCitation] = []
    suggested_followups: List[str] = []
    engine_used: str = "offline_heuristics"

