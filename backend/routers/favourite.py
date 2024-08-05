from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import SessionLocal
from models.favorite import Favorite as FavoriteModel
from schemas.favorite import FavoriteCreate, Favorite as FavoriteSchema

router = APIRouter(
    prefix='/api/v1/favorite',
    tags=['Favorite']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/', response_model=list[FavoriteSchema])
def get_Favorites(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    Favorites = db.query(FavoriteModel).offset(skip).limit(limit).all()
    return Favorites

@router.get('/{Favorite_id}', response_model=FavoriteSchema)
def get_Favorite(Favorite_id: int, db: Session = Depends(get_db)):
    Favorite = db.query(FavoriteModel).filter(FavoriteModel.id == Favorite_id).first()
    if Favorite is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")
    return Favorite
