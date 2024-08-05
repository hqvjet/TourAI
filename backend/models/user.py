from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    age = Column(Integer)
    user_name = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)

    comments = relationship("Comment", back_populates="users")
    own_services = relationship("OwnService", back_populates="users")
    favorites = relationship("Favorite", back_populates="users")