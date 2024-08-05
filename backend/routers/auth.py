from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from schemas.user import UserCreate
from models.user import User as UserModel
from models.admin import Admin as AdminModel
from db import get_db
from passlib.context import CryptContext
from jose import JWTError, jwt
import logging
from datetime import datetime, timedelta
from decouple import config

SECRET_KEY = config('SECRET_KEY', default='a6s7d8vv74ck2kf0vm20c87d8gw9w6v8d86s78ef789v9')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix='/api/v1/auth',
    tags=['Authentication']
)

logging.basicConfig(level=logging.INFO)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register")
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    logging.debug(f"Received user data: {user_data.dict()}")
    try:
        existing_user = db.query(UserModel).filter(UserModel.user_name == user_data.user_name).first()
        if existing_user:
            logging.warning("Username already exists")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tên đăng nhập đã tồn tại")
        if user_data.password != user_data.confirmPassword:
            logging.warning("Passwords do not match")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mật khẩu không khớp")
        hashed_password = pwd_context.hash(user_data.password)
        new_user = UserModel(
            full_name=user_data.full_name,
            age=user_data.age,
            user_name=user_data.user_name,
            password=hashed_password,
            role=user_data.role
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logging.info("User created successfully")
        return {"message": f"Tạo tài khoản {user_data.role.lower()} thành công"}
    
    except HTTPException as e:
        logging.error(f"HTTPException: {str(e.detail)}")
        raise
    
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.post('/login')
def login(login_data: dict, db: Session = Depends(get_db), response: Response = None):
    try:
        user_name = login_data.get('user_name')
        password = login_data.get('password')
        user = db.query(UserModel).filter(UserModel.user_name == user_name).first()
        if user and pwd_context.verify(password, user.password):
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user.user_name, "role": user.role, "user_id": user.id},
                expires_delta=access_token_expires
            )
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,
                samesite="Lax"
            )
            return {"user_name": user.user_name, "full_name": user.full_name, "role": user.role, "user_id": user.id}
        admin = db.query(AdminModel).filter(AdminModel.user_name == user_name).first()
        if admin and pwd_context.verify(password, admin.password):
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": admin.user_name, "role": "admin", "user_id": admin.id},
                expires_delta=access_token_expires
            )
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,
                samesite="Lax"
            )
            return {"user_name": admin.user_name, "role": "admin", "user_id": admin.id}

        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
        
    except HTTPException as e:
        logging.error(f"HTTPException: {str(e.detail)}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")


def get_current_user(request: Request):
    token = request.cookies.get('access_token')
    if token:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_name: str = payload.get("sub")
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return user_name
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

@router.get('/me')
def get_me(request: Request, db: Session = Depends(get_db)):
    user_name = get_current_user(request)
    user = db.query(UserModel).filter(UserModel.user_name == user_name).first()
    if user:
        return {"full_name": user.full_name, "role": user.role, "user_id": user.id}
    
    admin = db.query(AdminModel).filter(AdminModel.user_name == user_name).first()
    if admin:
        return {"user_name": admin.user_name, "role": "admin", "user_id": admin.id}
    
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
@router.post('/logout')
def logout(response: Response):
    response.delete_cookie('access_token')
    return {"message": "Logged out successfully"}
