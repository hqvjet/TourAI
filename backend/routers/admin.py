from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import SessionLocal
from models.admin import Admin as AdminModel
from schemas.admin import Admin as AdminSchema, AdminCreate
import bcrypt

router = APIRouter(
    prefix='/api/v1/admin',
    tags=['Admin']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/', response_model=AdminSchema, status_code=status.HTTP_201_CREATED)
def create_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    existing_admin = db.query(AdminModel).filter(AdminModel.user_name == admin.user_name).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin with this username already exists."
        )
    
    hashed_password = bcrypt.hashpw(admin.password.encode('utf-8'), bcrypt.gensalt())
    
    new_admin = AdminModel(
        user_name=admin.user_name,
        password=hashed_password.decode('utf-8')
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    return new_admin
