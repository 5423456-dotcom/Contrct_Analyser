from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class ContactBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    name: str = Field(..., min_length=1, max_length=150)
    email: Optional[str] = Field(default="", max_length=255)
    phone: Optional[str] = Field(default="", max_length=50)
    category: str = Field(default="Peer / Student", max_length=100)
    tags: List[str] = Field(default_factory=list)
    last_interaction: Optional[str] = Field(default=None, alias="lastInteraction")
    interaction_frequency: str = Field(default="Monthly", alias="interactionFrequency")
    priority: str = Field(default="Medium", max_length=20)
    notes: Optional[str] = Field(default="")

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    email: Optional[str] = None
    phone: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    last_interaction: Optional[str] = Field(default=None, alias="lastInteraction")
    interaction_frequency: Optional[str] = Field(default=None, alias="interactionFrequency")
    priority: Optional[str] = None
    notes: Optional[str] = None

class ContactResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    id: str
    name: str
    email: Optional[str] = ""
    phone: Optional[str] = ""
    category: str = "Peer / Student"
    tags: List[str] = Field(default_factory=list)
    last_interaction: Optional[str] = Field(default=None, alias="lastInteraction")
    interaction_frequency: str = Field(default="Monthly", alias="interactionFrequency")
    priority: str = "Medium"
    notes: Optional[str] = ""
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class InactiveContactAlert(BaseModel):
    contact: ContactResponse
    days_ago: int = Field(..., alias="daysAgo")

class DuplicateContactAlert(BaseModel):
    reason: str
    value: str
    contact1: ContactResponse
    contact2: ContactResponse

class AiRecommendation(BaseModel):
    type: str
    title: str
    description: str
    action_text: str = Field(..., alias="actionText")

class ContactAnalyticsResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    total_contacts: int = Field(..., alias="totalContacts")
    active_count: int = Field(..., alias="activeCount")
    inactive_count: int = Field(..., alias="inactiveCount")
    high_priority_count: int = Field(..., alias="highPriorityCount")
    missing_info_count: int = Field(..., alias="missingInfoCount")
    health_score: int = Field(..., alias="healthScore")
    category_breakdown: Dict[str, int] = Field(default_factory=dict, alias="categoryBreakdown")
    frequency_breakdown: Dict[str, int] = Field(default_factory=dict, alias="frequencyBreakdown")
    inactive_high_priority: List[InactiveContactAlert] = Field(default_factory=list, alias="inactiveHighPriority")
    duplicates: List[DuplicateContactAlert] = Field(default_factory=list)
    ai_recommendations: List[AiRecommendation] = Field(default_factory=list, alias="aiRecommendations")

class CsvImportPayload(BaseModel):
    csv_text: str

class CsvImportResponse(BaseModel):
    added_count: int = Field(..., alias="addedCount")
    total: int
