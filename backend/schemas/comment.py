from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class CommentBase(BaseModel):
    title: str
    content: str
    rating: Optional[int] = None
    service_id: int
    users_id: int
    created_at: Optional[datetime] = None

class CommentCreate(CommentBase):
    title: str
    content: str
    rating: Optional[int] = None
    service_id: int
    users_id: int

class Comment(CommentBase):
    service_id: int
    users_id: int
    created_at: Optional[datetime] = None
    full_name: Optional[str] = None

    class Config:
        from_attributes = True
