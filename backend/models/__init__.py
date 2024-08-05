from .admin import Admin
from .user import User
from .service import Service
from .service_image import ServiceImage
from .comment import Comment
from .own_service import OwnService
from .favorite import Favorite
from sqlalchemy.orm import relationship

Service.images = relationship("ServiceImage", back_populates="service")
Service.comments = relationship("Comment", back_populates="service")
User.comments = relationship("Comment", back_populates="users")
