from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import asc, desc, func
from db import SessionLocal
from models.service import Service as ServiceModel
from models.user import User as UserModel
from models.service_image import ServiceImage as ServiceImageModel
from models.comment import Comment as CommentModel
from models.own_service import OwnService as OwnServiceModel
from schemas.service import Service as ServiceSchema, ServiceResponse
from schemas.service_image import ServiceImageCreate, ServiceImage as ServiceImageSchema
from .auth import get_current_user

router = APIRouter(
    prefix='/api/v1/service',
    tags=['Service']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def fetch_image_urls(db: Session, service_id: int):
    return [url[0] for url in db.query(ServiceImageModel.image_url).filter(ServiceImageModel.service_id == service_id).all()]

def apply_sorting(query, sort_by, db):
    if sort_by in ["rating_asc", "rating_desc"]:
        subquery = db.query(
            CommentModel.service_id,
            func.avg(CommentModel.rating).label('average_rating')
        ).group_by(CommentModel.service_id).subquery()

        order_func = asc if sort_by == "rating_asc" else desc
        query = query.outerjoin(subquery, ServiceModel.id == subquery.c.service_id).order_by(order_func(subquery.c.average_rating))
    elif sort_by == "created_at_asc":
        query = query.order_by(asc(ServiceModel.created_at))
    elif sort_by == "created_at_desc":
        query = query.order_by(desc(ServiceModel.created_at))
    return query

@router.post('/create', response_model=ServiceSchema)
def create_service(service: ServiceSchema, request: Request, db: Session = Depends(get_db)):
    user_name = get_current_user(request)
    user = db.query(UserModel).filter(UserModel.user_name == user_name).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated")
    service_data = service.dict(exclude={'main_image_url', 'image_urls', 'average_rating'})
    db_service = ServiceModel(**service_data)
    db.add(db_service)
    db.commit()
    db.refresh(db_service)

    db_own_service = OwnServiceModel(users_id=user.id, service_id=db_service.id)
    db.add(db_own_service)
    db.commit()

    for image in service.image_urls:
        db_image = ServiceImageModel(service_id=db_service.id, **image.dict())
        db.add(db_image)
    db.commit()

    return db_service

@router.post('/{service_id}/images', response_model=ServiceImageSchema)
def create_service_image(service_id: int, image: ServiceImageCreate, db: Session = Depends(get_db)):
    db_service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    if not image.image_url:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Image URL cannot be empty")

    db_image = ServiceImageModel(service_id=service_id, **image.dict())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

@router.get('/', response_model=ServiceResponse)
def get_services(
    page: int = Query(1, ge=1),
    limit: int = Query(8, le=100),
    search: Optional[str] = None,
    type: Optional[str] = None,
    sort_by: Optional[str] = Query(None, regex="^(rating_asc|rating_desc|created_at_asc|created_at_desc)$"),
    db: Session = Depends(get_db)
):
    try:
        query = db.query(ServiceModel)
        
        if search:
            query = query.filter(ServiceModel.name.ilike(f'%{search}%'))
        if type and type != "all":
            query = query.filter(ServiceModel.type == type)
        
        query = apply_sorting(query, sort_by, db)

        total = query.count()
        services = query.offset((page - 1) * limit).limit(limit).all()
        
        for service in services:
            service.main_image_url = fetch_image_urls(db, service.id)[0] if fetch_image_urls(db, service.id) else None
            service.image_urls = fetch_image_urls(db, service.id)

        return {"services": services, "total": total}
    except Exception as e:
        print("Error in get_services:", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get('/all', response_model=List[ServiceSchema])
def get_all_services(db: Session = Depends(get_db)):
    try:
        services = db.query(ServiceModel).all()
        for service in services:
            service.main_image_url = fetch_image_urls(db, service.id)[0] if fetch_image_urls(db, service.id) else None
            service.image_urls = fetch_image_urls(db, service.id)

        return services
    except Exception as e:
        print("Error in get_all_services:", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.delete('/{service_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: int, db: Session = Depends(get_db)):
    db_service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    db.query(ServiceImageModel).filter(ServiceImageModel.service_id == service_id).delete(synchronize_session=False)
    db.delete(db_service)
    db.commit()
    return

@router.get('/my_services', response_model=List[ServiceSchema])
def get_my_services(user_id: int = Query(...), db: Session = Depends(get_db)):
    try:
        own_services = db.query(OwnServiceModel).filter(OwnServiceModel.users_id == user_id).all()
        service_ids = [own_service.service_id for own_service in own_services]

        services = db.query(ServiceModel).filter(ServiceModel.id.in_(service_ids)).all()

        for service in services:
            service.main_image_url = fetch_image_urls(db, service.id)[0] if fetch_image_urls(db, service.id) else None
            service.image_urls = fetch_image_urls(db, service.id)

        return services
    except Exception as e:
        print("Error in get_my_services:", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch services")

@router.get('/{service_id}', response_model=ServiceSchema)
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
    if service is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    
    image_urls = fetch_image_urls(db, service_id)
    service.main_image_url = image_urls[0] if image_urls else None
    service.image_urls = image_urls
    return service
