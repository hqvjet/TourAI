from sqlalchemy import Column, Integer, String
from db import Base

class Admin(Base):
    __tablename__ = 'admin'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_name = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
