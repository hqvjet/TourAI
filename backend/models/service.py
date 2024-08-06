from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db import Base

class Service(Base):
    __tablename__ = 'service'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    address = Column(String(255))
    geolocation = Column(String(255))
    type = Column(String(50))
    phone = Column(String(20))
    website = Column(String(255))
    email = Column(String(255))
    created_at = Column(TIMESTAMP, default=func.now())

    images = relationship('ServiceImage', back_populates='service', cascade='all, delete-orphan')
    comments = relationship("Comment", back_populates="service")
    own_services = relationship("OwnService", back_populates="service", cascade='all, delete-orphan')
    favorites = relationship("Favorite", back_populates="service")