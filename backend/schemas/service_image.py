from pydantic import BaseModel

class ServiceImageCreate(BaseModel):
    image_url : str

class ServiceImage(BaseModel):
    service_id: int

    class Config:
        from_attributes = True
