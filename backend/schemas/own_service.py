from pydantic import BaseModel

class OwnServiceCreate(BaseModel):
    pass

class OwnService(BaseModel):
    user_id: int
    service_id: int

    class Config:
        from_attributes = True
