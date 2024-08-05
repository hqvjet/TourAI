from pydantic import BaseModel

class FavoriteCreate(BaseModel):
    pass

class Favorite(BaseModel):
    user_id: int
    service_id: int

    class Config:
        from_attributes = True
