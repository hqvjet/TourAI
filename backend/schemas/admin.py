from pydantic import BaseModel

class AdminBase(BaseModel):
    user_name: str
    password : str

class AdminCreate(AdminBase):
    pass

class AdminLogin(BaseModel):
    password: str

class Admin(AdminBase):
    id: int

    class Config:
        from_attributes = True
