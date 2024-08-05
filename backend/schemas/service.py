from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ServiceBase(BaseModel):
    id: Optional[int] = None 
    name: str
    address: Optional[str] = None
    website: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    email: Optional[str] = None
    image_urls: Optional[List[str]] = None
    phone: str
    created_at: Optional[datetime] = None
    average_rating: Optional[float] = None


class Service(ServiceBase):
    id: Optional[int] = None 
    created_at: Optional[datetime] = None
    image_urls: List[str] = []
    average_rating: Optional[float] = None

    class Config:
        from_attributes = True

class ServiceResponse(BaseModel):
    services: List[ServiceBase]
    total: int
