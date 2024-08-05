from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    user_name: str
    full_name: str
    age: Optional[int] = None
    role: str

class UserCreate(UserBase):
    password: str
    confirmPassword: str

class UserLogin(BaseModel):
    user_name: str
    password: str

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True
