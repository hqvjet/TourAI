from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Favorite(Base):
    __tablename__ = 'favorite'

    users_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    service_id = Column(Integer, ForeignKey('service.id', ondelete='CASCADE'), primary_key=True)

    users = relationship("User", back_populates="favorites")
    service = relationship("Service", back_populates="favorites")
