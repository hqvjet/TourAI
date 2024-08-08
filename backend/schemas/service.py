from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ServiceBase(BaseModel):
    id: Optional[int] = None 
    name: Optional[str] = None
    address: Optional[str] = None
    geolocation: Optional[str] = None
    website: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    email: Optional[str] = None
    image_urls: Optional[List[str]] = None
    phone: Optional[str] = None
    created_at: Optional[datetime] = None
    average_rating: Optional[float] = None


class Service(ServiceBase):
    id: Optional[int] = None 
    created_at: Optional[datetime] = None
    image_urls: List[str] = []
    average_rating: Optional[float] = None

    class Config:
        from_attributes = True
        
class ServiceCreate(BaseModel):
    name: str
    address: str
    geolocation: str
    website: str
    type: str
    description: str
    email: str
    phone: str

class ServiceResponse(BaseModel):
    services: List[ServiceBase]
    total: int
