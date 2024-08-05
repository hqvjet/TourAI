from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session
from db import SessionLocal
from models.comment import Comment as CommentModel
from models.service import Service as ServiceModel
from models.user import User as UserModel
from models.own_service import OwnService as OwnServiceModel
from schemas.comment import CommentCreate, Comment as CommentSchema

router = APIRouter(
    prefix='/api/v1/comment',
    tags=['Comment']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/{service_id}', response_model=List[CommentSchema])
def get_comments_by_service(service_id: int, db: Session = Depends(get_db)):
    comments = db.query(CommentModel).filter(CommentModel.service_id == service_id).all()
    if not comments:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No comments found for this service")
    
    comments_with_full_names = []
    for comment in comments:
        user = db.query(UserModel).filter(UserModel.id == comment.users_id).first()
        comment_data = {
            "title": comment.title,
            "content": comment.content,
            "rating": comment.rating,
            "service_id": comment.service_id,
            "users_id": comment.users_id,
            "created_at": comment.created_at,
            "full_name": user.full_name if user else None
        }
        comments_with_full_names.append(CommentSchema(**comment_data))
    
    return comments_with_full_names

@router.post('/', response_model=CommentSchema)
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    existing_comment = db.query(CommentModel).filter(
        CommentModel.service_id == comment.service_id,
        CommentModel.users_id == comment.users_id
    ).first()
    
    if existing_comment:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User has already commented on this service")
    
    db_comment = CommentModel(
        title=comment.title,
        content=comment.content,
        rating=comment.rating,
        service_id=comment.service_id,
        users_id=comment.users_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)

    return CommentSchema.from_orm(db_comment)

@router.get('/', response_model=List[CommentSchema])
def get_comments(
    type: Optional[str] = Query(None),
    min_rating: Optional[int] = Query(None),
    max_rating: Optional[int] = Query(None),
    sort_by: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    comments_query = db.query(CommentModel)

    if type:
        comments_query = comments_query.join(ServiceModel).filter(ServiceModel.type == type)
    if min_rating is not None:
        comments_query = comments_query.filter(CommentModel.rating >= min_rating)
    if max_rating is not None:
        comments_query = comments_query.filter(CommentModel.rating <= max_rating)
    
    if sort_by:
        if sort_by == "rating_asc":
            comments_query = comments_query.order_by(asc(CommentModel.rating))
        elif sort_by == "rating_desc":
            comments_query = comments_query.order_by(desc(CommentModel.rating))
        elif sort_by == "created_at_asc":
            comments_query = comments_query.order_by(asc(CommentModel.created_at))
        elif sort_by == "created_at_desc":
            comments_query = comments_query.order_by(desc(CommentModel.created_at))

    comments = comments_query.all()
    comments_with_full_names = []
    for comment in comments:
        user = db.query(UserModel).filter(UserModel.id == comment.users_id).first()
        comment_data = {
            "title": comment.title,
            "content": comment.content,
            "rating": comment.rating,
            "service_id": comment.service_id,
            "users_id": comment.users_id,
            "created_at": comment.created_at,
            "full_name": user.full_name if user else None
        }
        comments_with_full_names.append(CommentSchema(**comment_data))
    
    return comments_with_full_names

@router.get('/business/{user_id}', response_model=List[CommentSchema])
def get_comments_by_business(
    user_id: int,
    type: Optional[str] = Query(None),
    min_rating: Optional[int] = Query(None),
    max_rating: Optional[int] = Query(None),
    sort_by: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        own_services = db.query(OwnServiceModel).filter(OwnServiceModel.users_id == user_id).all()
        service_ids = [own_service.service_id for own_service in own_services]
        
        comments_query = db.query(CommentModel).filter(CommentModel.service_id.in_(service_ids))

        if type:
            comments_query = comments_query.join(ServiceModel).filter(ServiceModel.type == type)
        if min_rating is not None:
            comments_query = comments_query.filter(CommentModel.rating >= min_rating)
        if max_rating is not None:
            comments_query = comments_query.filter(CommentModel.rating <= max_rating)
        
        if sort_by:
            if sort_by == "rating_asc":
                comments_query = comments_query.order_by(asc(CommentModel.rating))
            elif sort_by == "rating_desc":
                comments_query = comments_query.order_by(desc(CommentModel.rating))
            elif sort_by == "created_at_asc":
                comments_query = comments_query.order_by(asc(CommentModel.created_at))
            elif sort_by == "created_at_desc":
                comments_query = comments_query.order_by(desc(CommentModel.created_at))

        comments = comments_query.all()
        comments_with_full_names = []
        for comment in comments:
            user = db.query(UserModel).filter(UserModel.id == comment.users_id).first()
            comment_data = {
                "title": comment.title,
                "content": comment.content,
                "rating": comment.rating,
                "service_id": comment.service_id,
                "users_id": comment.users_id,
                "created_at": comment.created_at,
                "full_name": user.full_name if user else None
            }
            comments_with_full_names.append(CommentSchema(**comment_data))
        
        return comments_with_full_names
    except Exception as e:
        print("Error in get_comments:", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch comments")
