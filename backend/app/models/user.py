from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class UserModel(BaseModel):
    id: Optional[str] = None
    name: str
    email: EmailStr
    password_hash: str
    created_at: datetime = datetime.utcnow()
