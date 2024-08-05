from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db import Base

class Comment(Base):
    __tablename__ = 'comment'

    service_id = Column(Integer, ForeignKey('service.id', ondelete='CASCADE'), primary_key=True)
    users_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    title = Column(String(255))
    content = Column(Text)
    rating = Column(Integer)
    created_at = Column(TIMESTAMP, default=func.now())

    service = relationship("Service", back_populates="comments")
    users = relationship("User", back_populates="comments")
