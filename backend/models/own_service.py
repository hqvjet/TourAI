from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db import Base

class OwnService(Base):
    __tablename__ = 'own_service'

    users_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    service_id = Column(Integer, ForeignKey('service.id', ondelete='CASCADE'), primary_key=True)

    users = relationship("User", back_populates="own_services")
    service = relationship("Service", back_populates="own_services")