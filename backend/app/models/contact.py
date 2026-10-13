from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class ContactModel(BaseModel):
    id: Optional[str] = None
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    category: str = "Peer / Student"
    tags: List[str] = Field(default_factory=list)
    last_interaction: Optional[str] = None
    interaction_frequency: str = "Monthly"
    priority: str = "Medium"
    notes: Optional[str] = None
    user_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
