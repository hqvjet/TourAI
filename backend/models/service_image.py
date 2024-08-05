from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from db import Base

class ServiceImage(Base):
    __tablename__ = 'service_image'

    service_id = Column(Integer, ForeignKey('service.id', ondelete='CASCADE'), primary_key=True)
    image_url = Column(Text, nullable=False)

    service = relationship("Service", back_populates="images")